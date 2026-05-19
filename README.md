# NTE Guide (异环攻略站)

异环 (Neverness to Everness) 游戏攻略维基站，域名 `nteguide.com`，支持 13 种语言。

## 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | Next.js 14 (App Router, `output: 'export'` 静态导出) |
| 语言 | TypeScript 5.9 |
| 样式 | Tailwind CSS 3.4 |
| 验证 | Zod (数据 schema) |
| 搜索 | Fuse.js (客户端模糊搜索) |
| 地图 | Leaflet + react-leaflet |
| 评论 | @giscus/react (GitHub Discussions) |
| 测试 | Vitest (单元) + Playwright (E2E) |
| 部署 | GitHub → Cloudflare Pages (自动 Git 集成) |

## 目录结构

```
yh-wiki/
├── app/                    # Next.js App Router 页面
│   ├── [lang]/             # 13 语言动态路由 (zh/tw/en/th/vi/id/pt-br/ja/ko/de/fr/es/ru)
│   │   ├── page.tsx        # 首页
│   │   ├── layout.tsx      # 根 layout (generateStaticParams 生成所有语言)
│   │   ├── characters/     # 角色列表 + [slug] 详情
│   │   ├── weapons/        # 武器列表 + [slug] 详情
│   │   ├── vehicles/       # 载具列表 + [slug] 详情
│   │   ├── materials/      # 材料列表 + [slug] 详情
│   │   ├── guides/         # 攻略列表 + [slug] 详情
│   │   ├── blog/           # 博客列表 + [slug] 详情
│   │   ├── faq/            # FAQ 列表 + [slug] 详情
│   │   ├── lore/           # 世界观列表 + [slug] 详情
│   │   ├── locations/      # 地点列表 + [slug] 详情
│   │   ├── changelog/      # 更新日志列表 + [version] 详情
│   │   ├── anomalies/      # 异常体列表 + [slug] 详情
│   │   ├── disk-sets/      # 卡带套装列表 + [slug] 详情
│   │   ├── tags/           # 标签聚合页 + [tag] 详情
│   │   ├── compare/        # 对比页 (vs Genshin/WuWa/HSR/ZZZ/Ananta)
│   │   ├── calculator/     # 计算器工具
│   │   │   ├── leveling/   #   升级计算器
│   │   │   ├── build/      #   配装计算器
│   │   │   ├── stats/      #   属性计算器
│   │   │   ├── planner/    #   材料规划器
│   │   │   └── disk-score/ #   卡带评分器
│   │   ├── gacha/          # 抽卡模拟器
│   │   ├── gacha-analyzer/ # 抽卡记录分析
│   │   ├── team-builder/   # 配队工具
│   │   ├── tier-list/      # 角色强度榜
│   │   ├── compare-characters/ # 角色对比工具
│   │   ├── events/         # 活动日历
│   │   ├── bosses/         # Boss 攻略
│   │   ├── city-tycoon/    # 城市大亨追踪
│   │   ├── effects/        # 元素效果词典
│   │   ├── map/            # 交互式地图
│   │   ├── explorer/       # 探索进度
│   │   ├── redeem-codes/   # 兑换码
│   │   ├── about/          # 关于
│   │   ├── contact/        # 联系
│   │   ├── terms/          # 服务条款
│   │   ├── privacy-policy/ # 隐私政策
│   │   └── ...             # 其他静态页
│   └── page.tsx            # 根路径重定向 → /en
├── components/             # 43 个 React 组件
├── data/                   # JSON 数据文件 (内容层)
├── lib/                    # 工具函数库
├── messages/               # 13 个语言翻译 JSON
├── public/                 # 静态资源 (图片/sitemap/API JSON)
├── scripts/                # 构建/数据脚本
├── e2e/                    # Playwright E2E 测试
└── docs/                   # SOP 文档
```

## 数据层

所有内容存储在 `data/` 目录下的 JSON 文件中，构建时直接导入。无数据库。

### 核心 JSON 文件

| 文件 | 说明 | 关键字段 |
|---|---|---|
| `characters.json` | 角色数据 (339KB) | `id, name, nameEn, attribute, rank, role/roleEn, skills, recommendedBuild, tierRank, status, availableAtLaunch` |
| `weapons.json` | 武器数据 | `id, name/nameEn, rank, type, baseAtk, substat, signatureCharacter` |
| `materials.json` | 材料数据 | `id, name/nameEn, type, rarity, source` |
| `character-materials.json` | 角色升级材料映射 | `characterId → levelingMaterials[], skillMaterials[]` |
| `builds.json` | 角色配装方案 | `characterId → builds[{ mainStat, subStats, recommendedWeapons[], teamComp[] }]` |
| `guides.json` | 攻略文章 | `id, title/titleEn, category, content/contentEn, tags` |
| `blog.json` | 博客文章 | `id, title/titleEn, content/contentEn, category, date, tags` |
| `faqs.json` | FAQ | `id, question/questionEn, answer/answerEn, tags, category` |
| `compares.json` | 游戏对比文章 | `id, title/titleEn, content/contentEn, tags` |
| `changelog.json` | 版本更新日志 | `id, version, versionName/En, date, type, highlights/En, sections[]` |
| `disk-sets.json` | 卡带套装 | `id, name/nameEn, category, element, setDescription2pc/4pc` |
| `anomalies.json` | 异常体 | `id, name/nameEn, type, attribute, hp, weakness, mechanics, drops` |
| `vehicles.json` | 载具 | `id, name/nameEn, type, stats{acceleration,shift,brake,drift}, price` |
| `locations.json` | 地点 | `id, name/nameEn, category, content/contentEn` |
| `lore.json` | 世界观 | `id, name/nameEn, category, content/contentEn` |
| `gacha.json` | 抽卡池配置 | `limited/beginner/standard/weapons → {rate, pity, softPity, has5050}` |
| `redeem-codes.json` | 兑换码 | `code, reward/rewardEn, status, expiresAt, region` |
| `system-requirements.json` | 系统需求 | 各平台最低/推荐配置 |
| `troubleshooting.json` | 故障排除 | 问题描述 + 解决方案 |

### 数据的双语模型

大部分内容实体同时存储中文和英文字段：
- `name` / `nameEn` / `nameTw` (繁体中文)
- `description` / `descriptionEn`
- `content` / `contentEn`
- 渲染时根据当前 locale 选择对应字段

### 角色状态过滤

- `status: "available"` — 已上线角色
- `status: "upcoming"` — 未上线角色
- `availableAtLaunch: false` — 开服不可用

**重要**: 列表页和工具页使用 `getAvailableCharacters()` 过滤未上线角色；详情页 `characters/[slug]` 和标签页 `tags/[tag]` 使用 `getAllCharacters()` 保留全部。

## Lib 工具层

| 文件 | 职责 |
|---|---|
| `queries.ts` | **核心数据访问层** — ~40 个类型化查询函数 (`getAllCharacters`, `getAvailableCharacters`, `getCharacter`, `calculateMaterials` 等) + 所有 TypeScript 接口定义 |
| `schemas.ts` | Zod 验证 schema — 构建时校验 characters/weapons/materials 数据完整性 |
| `i18n.ts` | 国际化系统 — 13 语言定义, `t(locale, path)` 翻译函数, `hreflangAlternates()` SEO, `isZhLocale()` 中文判断 |
| `attributes.ts` | 游戏常量 — 属性颜色/标签、弧刃类型、品级、副词条等，均有 `Record<Locale, string>` 多语言 |
| `analytics.ts` | Google Analytics — `trackPageView()`, `trackEvent()`, `getPageType()` |
| `placeholder.ts` | SVG 占位图生成 |
| `map-utils.ts` | Leaflet 地图工具 — marker 类型/图标工厂 |
| `map-progress.ts` | 地图收集进度 — localStorage `nte-map-progress` 持久化 |
| `use-map-data.ts` | React hook — 按区域懒加载地图 JSON 数据 |
| `explorer-utils.ts` | 探索路线优化 (最近邻 TSP)、统计、筛选 |
| `gacha-analyzer-storage.ts` | 抽卡记录追踪 — localStorage `nte-gacha-analyzer` |

## 构建流程

```bash
npm run build
```

完整流程依次执行：

### 1. `scripts/prebuild.js` — 预构建

- **搜索索引**: 扫描 characters/weapons/materials/faqs/guides/lore/locations → `public/search-index.json`
- **Sitemap**: 生成 6 个子 sitemap + index → `public/sitemap*.xml`
- **API JSON**: 导出 `public/api/characters.json` + `public/api/redeem-codes.json`

### 2. `next build` — Next.js 静态导出

- `output: 'export'` + `trailingSlash: true`
- `generateStaticParams()` 为所有 13 语言 × 所有路由生成静态 HTML
- 产物输出到 `.next/server/app/`

### 3. `scripts/build-static.sh` — 组装静态站点

- 复制 `.next/static` → `out/_next/`
- 复制 `public/*` → `out/`
- 将 `.next/server/app/` 中的 HTML 文件放到 `out/` 对应目录结构中 (trailing slash)

### 4. `scripts/generate-redirects.js` — 生成重定向

- 扫描 `out/` 所有路由
- 生成 Cloudflare Pages `_redirects` 文件 (`/path` → `/path/` 301)
- 保留 `public/_redirects.manual` 中的手动规则

### 5. `scripts/patch-next.sh` — Next.js 14 兼容补丁 (postinstall)

修复 Next.js 14 在 Node.js 20 下的 5 个 bug (generate-build-id, load-jsconfig, type-check, export, build tracing)。

## 部署

- **平台**: Cloudflare Pages (Git 自动集成)
- **域名**: `nteguide.com`
- **触发**: push 到 `main` 分支自动部署
- **缓存策略**: `public/_headers` 定义 (`_next/static` 1 年不可变, 图片 7 天, sitemap 1 小时)

### IndexNow

`.github/workflows/deploy.yml` — push 到 main 时自动提交变更 URL 到 Bing/Yandex IndexNow API。

## 国际化 (i18n)

### 13 种语言

`zh`, `tw`, `en`, `th`, `vi`, `id`, `pt-br`, `ja`, `ko`, `de`, `fr`, `es`, `ru`

### 翻译系统

- **UI 翻译**: `messages/{locale}.json` — 嵌套 JSON，用 `t(locale, "dot.path")` 读取，支持 `{0}` 占位符插值
- **内容翻译**: `data/*.json` 中的 `name/nameEn`、`content/contentEn` 字段，渲染时按 locale 选择
- **SEO**: `hreflangAlternates()` 为每个页面生成 13 语言 + x-default 的 `<link rel="alternate">`

### 添加新页面时的 i18n 检查清单

1. 在 `messages/*.json` (全部 13 个) 添加页面标题等翻译 key
2. 在 `components/Header.tsx` 导航菜单添加入口
3. 在 `components/Footer.tsx` 对应栏目添加入口
4. 在 `scripts/prebuild.js` 的 `toolPages` 或 `categoryPages` 数组添加路由
5. 运行 `npx next lint` + `npm run build` 验证

## 组件说明

### 布局/导航

| 组件 | 说明 |
|---|---|
| `Header.tsx` | 顶部导航栏 — 4 个下拉菜单 (攻略工具/数据库/博客/Wiki) + 语言切换 + 搜索 |
| `Footer.tsx` | 页脚 — 4 栏链接 (游戏数据/工具/内容/资源) + 社交链接 |
| `Breadcrumb.tsx` | 面包屑导航 |
| `SearchDialog.tsx` | 客户端搜索弹窗 (Fuse.js) |
| `QuickLinks.tsx` | 底部浮动快捷链接 |

### 数据展示

| 组件 | 说明 |
|---|---|
| `CharacterCard.tsx` | 角色卡片 |
| `CharacterFilter.tsx` | 角色筛选面板 |
| `WeaponCard.tsx` | 武器卡片 |
| `BossCardClient.tsx` | Boss 信息卡片 (可展开) |
| `TierListView.tsx` | 角色强度榜 (客户端交互) |
| `BuildRecommendation.tsx` | 配装推荐 |
| `CityTycoonTracker.tsx` | 城市大亨进度追踪 (localStorage) |

### 地图系统

| 组件 | 说明 |
|---|---|
| `InteractiveMap.tsx` | Leaflet 交互地图 |
| `MapSidebar.tsx` | 地图侧边栏筛选 |
| `MapMarkerDetail.tsx` | Marker 详情弹窗 |
| `MapProgressBar.tsx` | 收集进度条 |
| `MapRoutePlanner.tsx` | 收集路线规划 |

### 其他

| 组件 | 说明 |
|---|---|
| `ArticleContent.tsx` | 富文本文章渲染器 |
| `JsonLd.tsx` | JSON-LD 结构化数据 (SEO) |
| `GiscusComments.tsx` | GitHub Discussions 评论 |
| `ExplorerDashboard.tsx` | 探索进度仪表盘 |
| `GameImage.tsx` | 图片组件 (含 fallback) |

## localStorage 使用

| Key | 用途 | 所在页面 |
|---|---|---|
| `nte-city-tycoon-progress` | 城市大亨里程碑进度 | `/city-tycoon` |
| `nte-material-planner` | 材料规划器数据 | `/calculator/planner` |
| `nte-map-progress` | 地图收集进度 | `/map` |
| `nte-gacha-analyzer` | 抽卡记录 | `/gacha-analyzer` |

## 常用命令

```bash
npm run dev          # 本地开发
npm run build        # 完整构建
npm run lint         # ESLint 检查
npm run test         # Vitest 单元测试
npm run test:e2e     # Playwright E2E 测试
npm run deploy       # 提交 IndexNow
```

## 注意事项

- **ESLint 严格模式**: Cloudflare CI 中 `@typescript-eslint/no-unused-vars` 是 error，本地 `next lint` 可能不报。提交前务必检查 unused imports。
- **静态导出限制**: 不能使用 `useSearchParams()` 不包裹 `<Suspense>`、不能使用 `getServerSideProps`、不能使用 Next.js Image 优化。
- **Trailing Slash**: 所有路由必须以 `/` 结尾，`generate-redirects.js` 自动处理 301 重定向。
- **图片**: 使用 `unoptimized: true`，图片直接放在 `public/images/` 下。
- **新角色上线**: 更新 `characters.json` 中 `status` 和 `availableAtLaunch` 字段，工具页自动过滤。
