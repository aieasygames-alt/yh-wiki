#!/bin/bash
# Fix Next.js 14 build bugs with Node.js 20
cd "$(dirname "$0")/.."

# Detect platform for sed compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_I=(sed -i '')
else
  SED_I=(sed -i)
fi

# 1. Fix generate-build-id: handle undefined generate function
"${SED_I[@]}" 's/let buildId = await generate();/let buildId = generate ? await generate() : null/' \
  node_modules/next/dist/build/generate-build-id.js

# 2. Fix load-jsconfig: handle undefined tsconfigPath
"${SED_I[@]}" "s/const tsConfigPath = _path.default.join(dir, config.typescript.tsconfigPath);/const tsConfigPath = _path.default.join(dir, config.typescript?.tsconfigPath || 'tsconfig.json');/" \
  node_modules/next/dist/build/load-jsconfig.js

# 3. Fix type-check: handle undefined tsconfigPath (keep config-driven ignoreBuildErrors)
"${SED_I[@]}" "s/!ignoreTypeScriptErrors, config.typescript.tsconfigPath/!ignoreTypeScriptErrors, config.typescript?.tsconfigPath || 'tsconfig.json'/" \
  node_modules/next/dist/build/type-check.js

# 4. Fix export: handle undefined publicRuntimeConfig
"${SED_I[@]}" 's/if (Object.keys(publicRuntimeConfig).length > 0) {/if (publicRuntimeConfig \&\& Object.keys(publicRuntimeConfig).length > 0) {/' \
  node_modules/next/dist/export/index.js

# 5. Fix build tracing: handle missing .nft.json files gracefully
"${SED_I[@]}" 's|await handleTraceFiles(_path.default.join(distDir, "next-server.js.nft.json"));|await handleTraceFiles(_path.default.join(distDir, "next-server.js.nft.json")).catch((err) => { console.warn("Skipping next-server.js trace:", err.message); });|' \
  node_modules/next/dist/build/utils.js
"${SED_I[@]}" 's|await handleTraceFiles(_path.default.join(distDir, "server", "instrumentation.js.nft.json"));|await handleTraceFiles(_path.default.join(distDir, "server", "instrumentation.js.nft.json")).catch((err) => { console.warn("Skipping instrumentation trace:", err.message); });|' \
  node_modules/next/dist/build/utils.js

echo "Next.js patches applied!"
