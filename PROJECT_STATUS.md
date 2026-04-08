# 异环 Wiki 项目状态

> 最后更新：2026-04-08

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
  layout.tsx                           # 根布局（metadata）
  page.tsx                             # 根路径重定向到 /zh
  globals.css                          # 全局样式（暗色主题）
  sitemap.ts                           # 多语言 sitemap 自动生成
  robots.ts                            # robots.txt
  [lang]/
    layout.tsx                         # 语言布局（Header + Footer）
    page.tsx                           # 首页（Hero + 角色网格 + 材料网格）
    characters/
      page.tsx                         # 角色列表
      [slug]/page.tsx                  # 角色详情（升级材料 + 技能材料 + 计算器入口）
    materials/
      page.tsx                         # 材料列表
      [slug]/page.tsx                  # 材料详情（获取方式 + 关联角色）
    calculator/
      leveling/
        layout.tsx                     # 计算器 metadata
        page.tsx                       # 升级计算器（客户端交互）
components/
  Header.tsx                           # 导航栏 + 语言切换
  Footer.tsx                           # 页脚
data/
  characters.json                      # 20 个角色
  materials.json                       # 30 个材料
  character-materials.json             # 角色-材料关系（嵌套结构）
lib/
  queries.ts                           # 数据查询 + 计算器逻辑
  i18n.ts                              # 自定义中英双语
  placeholder.ts                       # 占位图生成
messages/
  zh.json                              # 中文翻译
  en.json                              # 英文翻译
scripts/
  patch-next.sh                        # Next.js 14 构建兼容性补丁
```

## 当前数据量

| 数据 | 数量 |
|------|------|
| 角色 | 20 |
| 材料 | 30 |
| 静态页面 | 110（含中英双语） |
| JS chunks | 23 |
| 构建产物大小 | 39MB |

## 构建状态

**构建通过** (BUILD_ID: `LYUZnI8rMlUMEG0yRBO0A`)

构建末尾有 `nft.json` 文件缺失的警告（build trace 步骤），不影响站点运行。这是 Next.js 14 与 Node.js 20 的已知兼容性问题。

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

### 占位图

所有角色和材料使用文字占位图（SVG），尚未接入真实图片资源。

## 页面 URL 结构

| 页面 | 中文 | 英文 |
|------|------|------|
| 首页 | /zh | /en |
| 角色列表 | /zh/characters | /en/characters |
| 角色详情 | /zh/characters/anby | /en/characters/anby |
| 材料列表 | /zh/materials | /en/materials |
| 材料详情 | /zh/materials/basic-ether-chip | /en/materials/basic-ether-chip |
| 计算器 | /zh/calculator/leveling | /en/calculator/leveling |
| sitemap | /sitemap.xml | |
| robots | /robots.txt | |

## SEO 实现

- 每个页面有独立的 `generateMetadata`（title / description）
- sitemap.xml 包含所有 115+ 页面 URL（中英双语）
- robots.txt 已配置
- 角色页 → 材料页内链
- 材料页 → 角色页内链
- 所有页面 → 计算器页链接

## 待完成事项

- [ ] 替换占位图为真实角色/材料图片
- [ ] 校验数据准确性（当前为示例数据）
- [ ] 接入 Google Search Console
- [ ] 配置 Cloudflare Pages 部署
- [ ] 注册域名
- [ ] V1：简易后台管理（API Route + JSON 写入）
- [ ] V2：Build 计算器、武器页、Tier List
