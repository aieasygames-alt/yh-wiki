# 异环 Wiki 项目状态

> 最后更新：2026-04-13（V3 P0 + P1-A + P1-B + P2 + 索引修复 已完成）

## 项目概述

《异环》游戏数据库 + 养成计算器 SEO 站点。目标是抢占游戏早期的搜索流量窗口。

## 技术栈

| 模块 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 14.2.28 |
| 语言 | TypeScript | 5.9.3 |
| 样式 | Tailwind CSS | 3.4 |
| 数据 | JSON 静态文件 | - |
| 运行时 | Node.js | 20.x（必须） |

## 目录结构

```
app/
  layout.tsx                           # 根布局（metadata，metadataBase: nteguide.com）
  page.tsx                             # 根路径重定向到 /zh
  globals.css                          # 全局样式（暗色主题）
  sitemap.ts                           # 多语言 sitemap 自动生成
  robots.ts                            # robots.txt
  [lang]/
    layout.tsx                         # 语言布局（Header + Footer）
    page.tsx                           # 首页（Hero + 角色网格 + 材料网格）
    characters/
      page.tsx                         # 角色列表（含属性筛选）
      [slug]/page.tsx                  # 角色详情（升级材料 + 技能材料 + 计算器入口）
    weapons/
      page.tsx                         # 武器列表
      [slug]/page.tsx                  # 武器详情
    materials/
      page.tsx                         # 材料列表（含筛选）
      [slug]/page.tsx                  # 材料详情（获取方式 + 关联角色）
    faq/
      page.tsx                         # FAQ 列表
      [slug]/page.tsx                  # FAQ 详情
    calculator/
      leveling/
        layout.tsx                     # 计算器 metadata
        page.tsx                       # 升级计算器（客户端交互）
components/
  Header.tsx                           # 导航栏（5顶级项 + 3下拉菜单）+ 语言切换 + 移动端分组菜单
  Footer.tsx                           # 页脚（4列内链网格：Game Data / Tools / Content / Resources）
  Breadcrumb.tsx                       # 面包屑导航
  CharacterCard.tsx                    # 角色卡片
  CharacterFilter.tsx                  # 角色筛选组件
  WeaponCard.tsx                       # 武器卡片
  MaterialCard.tsx                     # 材料卡片
  MaterialFilter.tsx                   # 材料筛选组件
  GameImage.tsx                        # 图片组件（支持真实图 + SVG 占位回退）
  HreflangInjector.tsx                 # SEO hreflang 标签注入
  JsonLd.tsx                           # JSON-LD 结构化数据
  DataStatusBanner.tsx                 # 数据状态提示横幅
data/
  characters.json                      # 38 个角色
  materials.json                       # 35 个材料
  weapons.json                         # 42 个武器
  faqs.json                            # 21 条 FAQ
  guides.json                          # 13 篇攻略
  lore.json                            # 10 条世界观
  locations.json                       # 10 个地点
  character-materials.json             # 角色-材料关系（嵌套结构）
lib/
  queries.ts                           # 数据查询 + 计算器逻辑
  i18n.ts                              # 自定义中英双语（BASE_URL: nteguide.com）
  placeholder.ts                       # 占位图生成
messages/
  zh.json                              # 中文翻译
  en.json                              # 英文翻译
scripts/
  patch-next.sh                        # Next.js 14 构建兼容性补丁
public/
  images/characters/                   # 18 张角色真实图片（webp）
  images/materials/                    # 材料图片目录（暂无）
```

## 当前数据量

| 数据 | 数量 |
|------|------|
| 角色 | 38 |
| 材料 | 35 |
| 武器 | 42 |
| FAQ | 21 |
| 攻略 | 28 |
| Blog | 8 |
| 世界观 | 10 |
| 地点 | 10 |
| 兑换码 | 8 |
| 角色真实图片 | 18 |
| 静态页面 | 703（含中英双语 + Blog 页面） |

## 部署信息

| 项目 | 值 |
|------|-----|
| 平台 | Cloudflare Pages |
| 域名 | https://nteguide.com |
| 备用域名 | https://yh-wiki.pages.dev |
| 部署方式 | GitHub 自动部署（aieasygames-alt/yh-wiki，main 分支） |
| 构建命令 | npm run build |
| 输出目录 | out |

## 构建状态

**构建通过** — Cloudflare Pages 自动构建成功，站点正常访问。

构建末尾有 `nft.json` 文件缺失的警告（build trace 步骤），不影响站点运行。这是 Next.js 14 与 Node.js 20 的已知兼容性问题。

注意：构建时需清除环境变量 `TURBOPACK=1`（本地 shell 可能设置），Cloudflare 环境中不存在此问题。

## 运行方式

```bash
# 必须使用 Node.js 20（homebrew 安装的 node@20）
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

cd yh-wiki
npm install        # 安装依赖（自动运行 patch-next.sh）
npm run dev        # 开发模式 http://localhost:3000
npm run build      # 生产构建
npm run start      # 生产模式运行
```

## 已知问题

### Node.js 版本限制

Next.js 14.2.28 与 Node.js 25 不兼容。必须使用 Node.js 20。

`scripts/patch-next.sh` 在每次 `npm install` 后自动修复以下问题：

1. `generate-build-id.js`：处理 undefined 的 generate 函数
2. `load-jsconfig.js`：处理 undefined 的 tsconfigPath
3. `type-check.js`：强制跳过类型检查 + 修复 tsconfigPath
4. `index.js`：强制跳过 ESLint
5. `export/index.js`：处理 undefined 的 publicRuntimeConfig

### @/ 路径别名不可用

由于 `next-intl` 已移除，其 webpack 插件不再注入路径别名解析。当前所有导入使用相对路径。

### 材料图片缺失

角色已有 18 张真实图片（webp），材料仍使用 SVG 占位图。`public/images/materials/` 目录为空。

## 页面 URL 结构

| 页面 | 中文 | 英文 |
|------|------|------|
| 首页 | /zh | /en |
| 角色列表 | /zh/characters | /en/characters |
| 角色详情 | /zh/characters/nanally | /en/characters/nanally |
| 武器列表 | /zh/weapons | /en/weapons |
| 武器详情 | /zh/weapons/fangs-and-claws | /en/weapons/fangs-and-claws |
| 材料列表 | /zh/materials | /en/materials |
| 材料详情 | /zh/materials/basic-hunter-guide | /en/materials/basic-hunter-guide |
| FAQ 列表 | /zh/faq | /en/faq |
| FAQ 详情 | /zh/faq/how-to-level-up-fast | /en/faq/how-to-level-up-fast |
| 攻略列表 | /zh/guides | /en/guides |
| 攻略详情 | /zh/guides/beginner-guide | /en/guides/beginner-guide |
| 世界观列表 | /zh/lore | /en/lore |
| 世界观详情 | /zh/lore/espers | /en/lore/espers |
| 地点列表 | /zh/locations | /en/locations |
| 地点详情 | /zh/locations/hethereau | /en/locations/hethereau |
| 计算器 | /zh/calculator/leveling | /en/calculator/leveling |
| sitemap | /sitemap.xml | |
| robots | /robots.txt | |

## SEO 实现

- 每个页面有独立的 `generateMetadata`（title / description）
- sitemap.xml 包含所有 557+ 个页面 URL（中英双语）
- robots.txt 已配置（指向 nteguide.com/sitemap.xml）
- 角色页 → 材料页内链
- 材料页 → 角色页内链
- 武器页 → 角色页内链
- FAQ 页 → 角色页 / 材料页内链
- 所有页面 → 计算器页链接
- hreflang 标签（HreflangInjector 组件）
- JSON-LD 结构化数据（JsonLd 组件）
- 面包屑导航（Breadcrumb 组件）

## PRD 需求对照

### MVP（v1.0）— 全部完成

| 功能 | 状态 | 说明 |
|------|------|------|
| 角色页 20+ | ✅ | 21 个角色页 |
| 材料页 30 | ✅ | 35 个材料页 |
| 升级计算器 | ✅ | 可选角色、输入等级、计算材料 |
| 首页 | ✅ | Hero + 角色网格 + 材料网格 |
| sitemap.xml | ✅ | 192+ URL（含 Blog） |
| robots.txt | ✅ | 已配置 |
| 中英双语 | ✅ | /zh 和 /en |
| Cloudflare Pages | ✅ | 已部署 |
| 自定义域名 | ✅ | nteguide.com |

### V1（1-2 个月）

| 功能 | 状态 | 说明 |
|------|------|------|
| 武器页 | ✅ | 42 个武器，列表 + 详情页 |
| FAQ 模块 | ✅ | 21 条 FAQ，含角色培养建议、属性克制、体力管理等 |
| Tier List | ✅ | 以 FAQ 形式实现（s-rank-characters + 8 条角色培养评估） |
| 移动端适配 | ✅ | 响应式布局 + 汉堡菜单 |
| 页面扩展 300+ | ✅ | 当前 557 页 |
| Build 计算器 | ✅ | 角色头像网格 + 装备可视化 |

### 运营项

| 事项 | 状态 | 说明 |
|------|------|------|
| 角色真实图片 | ✅ | 18/21 张已添加 |
| 材料真实图片 | ❌ | public/images/materials/ 为空 |
| 数据准确性校验 | ⚠️ | 标注为"数据整理中"（DataStatusBanner） |
| Google Search Console | ❌ | 未接入验证 |

### V2（2-3 个月）— P0+P1+P2 全部完成 ✅

| 功能 | 状态 |
|------|------|
| 攻略指南模块 | ✅ | 13 篇攻略 |
| 世界观模块 | ✅ | 10 条 Lore |
| 地点模块 | ✅ | 10 个地点 |
| 角色扩充 | ✅ | 38 个角色 |
| 武器扩充 | ✅ | 42 把武器 |
| 抽卡模拟器 | ✅ | 动画+统计+保底提醒 |
| Build 计算器重写 | ✅ | 头像网格+装备可视化 |
| 兑换码追踪 | ✅ | 8 个码+一键复制 |
| 全站搜索 | ✅ | ⌘K + Fuse.js |
| 标签系统 | ✅ | 15 个标签聚合页 |
| 首页重构 | ✅ | 统计+工具+攻略+S角色 |

## V3 — SEO 深度升级（2026-04-10 启动）

> 关联文档：`DEV_PLAN_V3.md`、`../PRD-V3-nteguide-SEO升级计划.md`

### 目标

| 指标 | 当前 | V3 目标 |
|------|------|---------|
| 页面总数 | 557 | 900+ |
| SEO 评分 | 4.9/10 | 7.5+/10 |
| 角色页字数 | ~300 | ≥ 1200 |
| Schema 覆盖 | 部分 | 100% |
| FAQ 条目 | 21 | ~376 |
| Blog 文章 | 0 | 8+ |
| 攻略总数 | 13 | 28+ |

### Phase 1：P0 SEO 紧急修复（Week 1-2）— ✅ 已完成（2026-04-10）

| 任务 | 状态 | 说明 |
|------|------|------|
| On-Page SEO 元数据全面重写 | ✅ | 英文品牌 YiHuan → NTE/Neverness to Everness，Title 50-60字符，Description 120-160字符含 CTA |
| FAQ 数据编写（~350 条） | ✅ | 角色 190 + 武器 126 + 攻略 39 = 355 条，中英双语 |
| FaqSection 组件 + FAQPage Schema | ✅ | 手风琴 FAQ 组件 + FaqPageJsonLd |
| Schema 补全 | ✅ | Organization + VideoGame + Product + WebApplication + FaqPage |
| 内链结构优化（Hub-and-Spoke） | ✅ | 角色页 relatedCharacters + Tier 链接 + 攻略链接 |
| AI 可引用摘要块 | ✅ | CharacterSummary + WeaponSummary 结构化表格 |
| Google Search Console 接入 | ⬜ | 需运维配合 DNS 验证 |

### Phase 2：P1-A 内容数据扩充（Week 3-4）— ✅ 已完成（2026-04-10）

| 任务 | 状态 | 说明 |
|------|------|------|
| 38 角色技能数据编写 | ✅ | skills 字段（4技能/角色） |
| 38 角色配装/配队数据 | ✅ | recommendedBuild + teamComps |
| SkillDetail / BuildRecommendation / TeamCompCard / TierBadge 组件 | ✅ | 4 个新组件 |
| 角色页模板重构 | ✅ | 整合所有新模块 |
| 13 篇攻略扩写至 1200+ 字 | ✅ | 全部 13 篇已扩写 |
| 15 篇新攻略 | ✅ | 28 篇攻略总计，30 个新页面 |

### Phase 3：P1-B Blog 系统（Week 5-6）— ✅ 已完成（2026-04-10）

| 任务 | 状态 | 说明 |
|------|------|------|
| data/blog.json 数据文件 | ✅ | 8 篇 Blog，zh 1400+ 字符，en 2300+ 字符 |
| Blog 列表页 + 详情页 | ✅ | /blog 列表 + /blog/[slug] 详情 |
| BlogCard 组件 | ✅ | 文章卡片组件 |
| 8 篇 Blog 内容（中英双语） | ✅ | 16 个新页面，含 Article Schema + 内链 |
| Header/首页 Blog 入口 | ✅ | 导航 + 首页最新 3 篇 Blog 区块 + sitemap 更新 |

### Phase 4：P2 技术优化 + 对比页（Week 7-8）— ✅ 已完成（2026-04-12）

| 任务 | 状态 | 说明 |
|------|------|------|
| 导航栏重构（13项→5项+3下拉+Footer内链） | ✅ | 699 页面，每页 Footer 输出 ~13 条内链 |
| 图片补全（角色 20 + 武器 42 + 材料 35） | ⬜ | 素材获取（需外部资源） |
| 图片优化（WebP/alt/lazy/responsive） | ✅ | GameImage 新增 weapon type + priority + width/height |
| 3 个对比页 | ✅ | nte-vs-genshin / nte-vs-wuthering-waves / games-like-nte（6 页面） |
| Core Web Vitals 优化 | ✅ | GA lazyOnload + preconnect + poweredByHeader: false |
| Build 分享按钮 | ✅ | ShareBuildButton（Web Share API + 剪贴板） |

### Phase 4.5：GSC 索引问题修复 — ✅ 已完成（2026-04-13）

GSC 报告 4 个索引问题：Alternative page with canonical (3页)、Page with redirect (2页)、Discovered – not indexed (424页)、Crawled – not indexed (1页)。

| 问题 | 修复 | 详情 |
|------|------|------|
| Canonical 全指向 /zh/ | ✅ | `hreflangAlternates()` 改为接收 lang 参数，canonical 自引用 |
| 英文页不被索引 | ✅ | 所有 23 个页面调用更新，en 页 canonical → en，zh → zh |
| HreflangInjector 客户端渲染 | ✅ | 删除冗余组件，hreflang 已由 SSR `generateMetadata` 处理 |
| 缺少 robots.txt | ✅ | 新增 `public/robots.txt`，Allow + Sitemap URL |
| 缺少 x-default | ✅ | 所有 alternates.languages 新增 `x-default` 指向 /zh |
| Sitemap 优化 | ✅ | 重构去重，代码精简 |

**关于 424 页 "Discovered – currently not indexed"**：这是新站正常现象（域名权重低），canonical 修复后 Google 会重新评估。建议通过 GSC URL Inspection 手动提交关键页面加速收录。

### Phase 5：P3 持续运营（2026-04-29 游戏上线后启动）

> 游戏国服 4月23日、国际服 4月29日上线，P3 从建站转向运营增长。

#### 国际市场优先级

| 优先级 | 市场 | 语言 | 策略 |
|--------|------|------|------|
| T0 | 美国、日本、德国、巴西 | EN | 现有英文站直接覆盖 |
| T1 | 韩国、东南亚、法国、英国 | EN/本地语 | 跟进观察，按需投入 |
| T2 | 中东、东欧、北欧 | — | 暂不投入 |

短期保持中英双语。上线 2 个月后通过 GA4 评估是否新增语言版本（日语概率最高）。

#### 运营任务

| 任务 | 状态 | 频率/说明 |
|------|------|-----------|
| Blog 每周更新 | 🔄 | 上线首月 8 篇（见 PRD 内容日历），后续每周 1-2 篇 |
| 兑换码持续追踪 | 🔄 | 监控官方 Twitter/Discord，24h 内更新 JSON，过期码标记 Expired |
| 关键词监控 | 🔄 | 每周检查 GSC 收录/展现/排名，GA4 检查流量分布 |
| 外链建设 | 🔄 | Reddit 4 子版块 + Discord + 内容营销，每周 ≤2 帖 |
| Google Search Console 接入 | ⬜ | Cloudflare DNS TXT 验证 + sitemap 提交 |
| 图片补全（角色 38 + 武器 42 + 材料 35） | ⬜ | 上线后截图，批量处理 WebP |
| 数据准确性校验（CBT vs 正式版） | ⬜ | 逐页校验角色/武器/材料数据，更新 Tier List |

#### 月度运营节奏

| 周一 | 周三 | 周五 |
|------|------|------|
| GA4/GSC 数据检查 | Blog 发布 | 兑换码检查/更新 |
| Reddit/Discord 互动 | 社交媒体分享 | 关键词排名记录 |

### 运营项（从 V2 结转）

- [ ] Google Search Console 接入验证
- [ ] 补充角色真实图片（新增 17 个角色）
- [ ] 材料真实图片
- [ ] 校验数据准确性
- [ ] 兑换码持续更新
