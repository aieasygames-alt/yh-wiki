# 异环 Wiki 项目状态

> 最后更新：2026-04-09（V2 Phase 1 完成后）

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
  Header.tsx                           # 导航栏 + 语言切换（含移动端汉堡菜单）
  Footer.tsx                           # 页脚
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
  characters.json                      # 31 个角色
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
| 角色 | 31 |
| 材料 | 35 |
| 武器 | 42 |
| FAQ | 21 |
| 攻略 | 13 |
| 世界观 | 10 |
| 地点 | 10 |
| 角色真实图片 | 18 |
| 静态页面 | 345（含中英双语，sitemap 实际计数） |

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
- sitemap.xml 包含所有 345 个页面 URL（中英双语）
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
| sitemap.xml | ✅ | 192 个 URL |
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
| 页面扩展 300+ | ✅ | 当前 345 页 |
| Build 计算器 | ❌ | 尚未开发 |

### 运营项

| 事项 | 状态 | 说明 |
|------|------|------|
| 角色真实图片 | ✅ | 18/21 张已添加 |
| 材料真实图片 | ❌ | public/images/materials/ 为空 |
| 数据准确性校验 | ⚠️ | 标注为"数据整理中"（DataStatusBanner） |
| Google Search Console | ❌ | 未接入验证 |

### V2（2-3 个月）— Phase 1 已完成

| 功能 | 状态 |
|------|------|
| 攻略指南模块 | ✅ | 13 篇攻略 |
| 世界观模块 | ✅ | 10 条 Lore |
| 地点模块 | ✅ | 10 个地点 |
| 角色扩充 | ✅ | 31 个角色（目标 38） |
| 武器扩充 | ✅ | 42 把武器 |
| 抽卡模拟器 | ❌ |
| Build 计算器重写 | ❌ |
| 兑换码追踪 | ❌ |
| 全站搜索 | ❌ |
| 标签系统 | ❌ |
| 首页重构 | ❌ |

## 待完成事项

### Phase 2 — P1 差异化工具
- [ ] Build 计算器重写（角色选择 + 装备 + 属性计算）
- [ ] 抽卡模拟器优化（动画 + 统计面板 + 保底提醒）
- [ ] 兑换码追踪页（码表 + 一键复制 + 到期标记）

### Phase 3 — P2 体验提升
- [ ] 全站搜索（⌘K + Fuse.js）
- [ ] 标签系统（标签聚合页 + 标签云）
- [ ] 首页重构（Hero + 统计卡片 + 热门攻略 + 工具入口）
- [ ] 补充剩余 7 个角色数据（31 → 38）
- [ ] 材料真实图片

### 运营项
- [ ] Google Search Console 接入验证
- [ ] 补充角色真实图片（新角色）
- [ ] 校验数据准确性
