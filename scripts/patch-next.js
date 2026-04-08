#!/bin/bash

# 修复 Next.js 14 的配置加载 bug
# 问题：config.generateBuildId 可能是 undefined

# 修复 generate-build-id.js
sed -i '' 's/let buildId = await generate();/let buildId = generate ? await generate() : null;' \
  node_modules/next/dist/build/generate-build-id.js

# 修复 index.js 中的 eslint 检查
sed -i '' 's/Boolean(config.eslint.ignoreDuringBuilds)/Boolean(config.eslint?.ignoreDuringBuilds)/' \
  node_modules/next/dist/build/index.js

echo "Next.js patches applied successfully!"
