# V3 开发计划 — SEO 深度升级

> 创建：2026-04-10 | 负责人：研发 | 关联 PRD：PRD-V3-nteguide-SEO升级计划.md
>
> 原则：每周交付可部署产物，每阶段有明确验收。

---

## 开发节奏总览

```
Week 1-2  → P0：SEO 紧急修复（代码层）
Week 3-4  → P1-A：内容数据扩充（数据层）
Week 5-6  → P1-B：Blog 系统 + 新攻略（功能层）
Week 7-8  → P2：技术优化 + 对比页（体验层）
Week 9+   → P3：持续运营
```

---

## Phase 1：P0 SEO 紧急修复（Week 1-2）

**目标**：SEO 评分 4.9 → 6.5+，所有页面基础 SEO 达标

### 1.1 On-Page SEO 元数据重写 [D1-D2]

**任务拆分**：

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 首页 metadata 重写 | `app/[lang]/page.tsx` | Title/Description/H1 按 PRD 规范 |
| 2 | 角色详情 metadata 重写 | `app/[lang]/characters/[slug]/page.tsx` | 76 页 × Title/Description/H1 |
| 3 | 武器详情 metadata 重写 | `app/[lang]/weapons/[slug]/page.tsx` | 84 页 × Title/Description/H1 |
| 4 | 材料详情 metadata 重写 | `app/[lang]/materials/[slug]/page.tsx` | 70 页优化 |
| 5 | 攻略 metadata 重写 | `app/[lang]/guides/[slug]/page.tsx` | 26 页优化 |
| 6 | Lore/地点/FAQ/计算器/兑换码 metadata | 各对应 page.tsx | 全面优化 |
| 7 | 标签聚合页 metadata | `app/[lang]/tags/[tag]/page.tsx` | 30 页优化 |

**验收**：
- [ ] 所有 Title 50-60 字符，含目标关键词
- [ ] 所有 Description 120-160 字符，含 CTA
- [ ] 所有 H1 唯一且含关键词
- [ ] 英文页 Title 含 "Neverness to Everness" 或 "NTE"

### 1.2 FAQ 数据 + 模块 [D3-D5]

**任务拆分**：

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 编写角色 FAQ 数据（38×5=190 条） | `data/characters.json` | 新增 `faq` 字段 |
| 2 | 编写武器 FAQ 数据（42×3=126 条） | `data/weapons.json` | 新增 `faq` 字段 |
| 3 | 编写攻略 FAQ 数据（13×3=39 条） | `data/guides.json` | 新增 `faq` 字段 |
| 4 | 开发 FaqSection 组件 | `components/FaqSection.tsx` | 通用 FAQ 手风琴模块 |
| 5 | 集成 FAQ 到角色/武器/攻略页 | 各详情页 page.tsx | FAQ 区域渲染 |
| 6 | FAQPage JSON-LD Schema | `components/JsonLd.tsx` | FAQ 自动输出 Schema |

**验收**：
- [ ] 每个角色页 5 条 FAQ（中英双语）
- [ ] 每个武器页 3 条 FAQ
- [ ] 每个攻略页 3 条 FAQ
- [ ] FAQPage Schema 通过 Google Rich Results Test

### 1.3 Schema 补全 [D5-D6]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 首页 WebSite + Organization + VideoGame | `components/JsonLd.tsx` + `app/[lang]/page.tsx` | 3 个新 Schema 类型 |
| 2 | 武器页 Product Schema | `app/[lang]/weapons/[slug]/page.tsx` | Product JSON-LD |
| 3 | 计算器 WebApplication Schema | `app/[lang]/calculator/leveling/page.tsx` + build | WebApplication JSON-LD |
| 4 | 兑换码 Article + FAQPage | `app/[lang]/redeem-codes/page.tsx` | 新增 Schema |
| 5 | Breadcrumb 覆盖确认 | 所有 page.tsx | 全页面 BreadcrumbList |

**验收**：
- [ ] Google Rich Results Test 全部通过
- [ ] Schema 类型覆盖：WebSite / Organization / VideoGame / FAQPage / Product / WebApplication / BreadcrumbList / Article / CharacterJsonLd / ItemList

### 1.4 内链结构优化 [D6-D7]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 角色数据新增关联字段 | `data/characters.json` | relatedCharacters / recommendedWeapons / tierRank |
| 2 | 角色页底部"相关角色"模块 | `app/[lang]/characters/[slug]/page.tsx` | 2-3 个关联角色链接 |
| 3 | 角色页"推荐武器"链接 | `app/[lang]/characters/[slug]/page.tsx` | 2-3 个武器链接 |
| 4 | 角色页 → Tier List / 配队指南链接 | 同上 | 内链到攻略页 |
| 5 | Hub 页（角色列表/武器列表/攻略列表）内链强化 | 各列表页 page.tsx | 加强 Hub → Spoke 链接 |

**验收**：
- [ ] 每个角色页 ≥ 5 个内链
- [ ] Hub 页链接到所有 Spoke 页
- [ ] Spoke 页链接回 Hub 页

### 1.5 AI 可引用摘要块 [D7]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | CharacterSummary 组件 | `components/CharacterSummary.tsx` | 角色结构化表格摘要 |
| 2 | WeaponSummary 组件 | `components/WeaponSummary.tsx` | 武器结构化表格摘要 |
| 3 | 集成到详情页 | 角色页 + 武器页 | 摘要块渲染 |

**里程碑交付**：SEO 评分 ≥ 6.5，所有 Rich Results Test 通过

---

## Phase 2：P1-A 内容数据扩充（Week 3-4）

**目标**：角色页 300 字 → 1200+ 字，攻略页 800 字 → 1500+ 字

### 2.1 角色深度数据 [W3]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 编写 38 角色技能数据 | `data/characters.json` | skills 字段（普攻/技能/大招/被动） |
| 2 | 编写 38 角色配装推荐 | `data/characters.json` | recommendedBuild 字段 |
| 3 | SkillDetail 组件 | `components/SkillDetail.tsx` | 技能详解渲染模块 |
| 4 | BuildRecommendation 组件 | `components/BuildRecommendation.tsx` | 配装推荐卡片 |

### 2.2 角色配队 + Tier 评级 [W4]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 编写 38 角色配队数据 | `data/characters.json` | teamComps 字段 |
| 2 | 编写 38 角色Tier 评级 | `data/characters.json` | tierRank + tierReason 字段 |
| 3 | TeamCompCard 组件 | `components/TeamCompCard.tsx` | 配队推荐卡片 |
| 4 | TierBadge 组件 | `components/TierBadge.tsx` | Tier 评级徽章 |
| 5 | 角色页模板重构 | `app/[lang]/characters/[slug]/page.tsx` | 整合所有新模块 |

### 2.3 攻略扩写 [W3-W4]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 扩写 13 篇现有攻略至 1500+ 字 | `data/guides.json` | 内容扩充 |
| 2 | 新增 15 篇攻略（中英双语） | `data/guides.json` | 30 个新攻略页面 |

**里程碑交付**：角色页平均 1200+ 字，攻略 28 篇

---

## Phase 3：P1-B Blog 系统（Week 5-6）

**目标**：Blog 上线，8 篇初始文章，新增 16 页

### 3.1 Blog 系统开发 [W5]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 创建 blog.json 数据文件 | `data/blog.json` | Blog 文章数据结构 |
| 2 | Blog 列表页（分页） | `app/[lang]/blog/page.tsx` | Blog 列表 |
| 3 | Blog 详情页 | `app/[lang]/blog/[slug]/page.tsx` | 文章渲染 |
| 4 | BlogCard 组件 | `components/BlogCard.tsx` | 文章卡片 |
| 5 | Blog SEO（Article Schema + metadata） | 详情页 | 完整 SEO |
| 6 | Blog 内链（每篇 ≥ 3 个站内链接） | 内容数据 | 内链体系 |

### 3.2 Blog 内容创作 [W5-W6]

| # | 文章 | 字数 |
|---|------|------|
| 1 | NTE vs Genshin vs Wuthering Waves 对比 | 3000+ |
| 2 | NTE CBT 测试评测 | 2500+ |
| 3 | NTE 公测前必看指南 | 2000+ |
| 4 | NTE 全角色一览 | 1500+ |
| 5 | NTE 抽卡系统详解 | 2000+ |
| 6 | NTE 开放世界探索指南 | 2000+ |
| 7 | 版本 1.0 更新内容 | 1500+ |
| 8 | NTE 最佳设置优化指南 | 1500+ |

### 3.3 导航更新 [W6]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | Header 导航增加 Blog 入口 | `components/Header.tsx` | Blog 链接 |
| 2 | 首页增加 Blog 推荐区 | `app/[lang]/page.tsx` | 最新 3 篇 Blog 卡片 |
| 3 | sitemap 更新 | `app/sitemap.ts` | 包含 Blog URL |

**里程碑交付**：Blog 上线，页面总数 900+

---

## Phase 4：P2 技术优化 + 对比页（Week 7-8）

**目标**：Lighthouse SEO ≥ 98，Performance ≥ 90

### 4.1 图片优化 [W7]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | 补全角色图片（20 张缺失） | `public/images/characters/` | 38/38 |
| 2 | 添加武器图片（42 张） | `public/images/weapons/` | 全新 |
| 3 | 添加材料图片（35 张） | `public/images/materials/` | 全新 |
| 4 | 图片 WebP 转换 + 压缩 | 所有图片 | 格式统一 |
| 5 | 添加 alt 文本 + width/height | `components/GameImage.tsx` | CLS 优化 |
| 6 | 实现响应式图片（srcSet） | `components/GameImage.tsx` | 多分辨率支持 |
| 7 | 懒加载（首屏除外） | `components/GameImage.tsx` | loading="lazy" |

### 4.2 对比页开发 [W7-W8]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | CompareTable 组件 | `components/CompareTable.tsx` | 游戏对比表格 |
| 2 | NTE vs Genshin 页面 | `app/[lang]/compare/nte-vs-genshin/page.tsx` | 6 页（×2 语言） |
| 3 | NTE vs WuWa 页面 | `app/[lang]/compare/nte-vs-wuthering-waves/page.tsx` | — |
| 4 | Games like NTE 页面 | `app/[lang]/compare/games-like-nte/page.tsx` | — |
| 5 | 对比页 SEO（metadata + Schema） | 各页 | Article Schema |

### 4.3 Core Web Vitals 优化 [W8]

| # | 任务 | 涉及文件 | 产出 |
|---|------|----------|------|
| 1 | LCP 优化：首屏图片预加载 | `app/[lang]/layout.tsx` | preload 标签 |
| 2 | CLS 优化：字体预加载 + 图片固定尺寸 | layout + GameImage | 字体 + 图片尺寸 |
| 3 | JS 优化：非关键脚本延迟 | 各组件 | 减少阻塞 |
| 4 | next.config.mjs 启用图片优化 | `next.config.mjs` | 移除 unoptimized |
| 5 | Build 分享按钮 | `components/ShareBuildButton.tsx` | 一键分享功能 |

### 4.4 Google Search Console [W7]

| # | 任务 | 产出 |
|---|------|------|
| 1 | DNS 验证（Cloudflare） | GSC 验证通过 |
| 2 | 提交 sitemap.xml | 收录开始 |
| 3 | 监控面板建立 | 收录/排名/CWV 看板 |

**里程碑交付**：Lighthouse 全绿，GSC 接入完成

---

## Phase 5：P3 持续运营（Week 9+）

持续进行，不设终止日期：

- [ ] Blog 每周 1-2 篇更新
- [ ] 兑换码持续更新（标题带月份）
- [ ] 外链建设（Reddit/Discord 传播计算器）
- [ ] 关键词排名监控 + 内容调整
- [ ] 游戏上线后数据快速校验更新
- [ ] Tier List 随版本更新

---

## 关键依赖

```
P0.1 SEO 元数据重写 ──→ P0.2 FAQ 数据（可并行）
         │                        │
         └──────→ P0.3 Schema 补全 ←──┘
                      │
              P0.4 内链 + 摘要块
                      │
              P1-A 角色深度数据
                      │
              P1-B Blog 系统
                      │
              P2 技术优化
```

## 技术约束

- Node.js 20（Next.js 14 兼容性要求）
- 纯静态站（`output: export`），无服务端
- 数据全部 JSON 文件驱动
- 使用相对路径导入（@/ 不可用）
- 构建需运行 `scripts/patch-next.sh`

## 新增文件清单

```
components/
  FaqSection.tsx
  CharacterSummary.tsx
  WeaponSummary.tsx
  SkillDetail.tsx
  BuildRecommendation.tsx
  TeamCompCard.tsx
  TierBadge.tsx
  BlogCard.tsx
  CompareTable.tsx
  ShareBuildButton.tsx

app/[lang]/
  blog/page.tsx
  blog/[slug]/page.tsx
  compare/nte-vs-genshin/page.tsx
  compare/nte-vs-wuthering-waves/page.tsx
  compare/games-like-nte/page.tsx

data/
  blog.json
```

## 风险预警

| 风险 | 触发条件 | 应对 |
|------|----------|------|
| 内容创作跟不上排期 | W3 角色数据未完成 | 优先做热门角色，其余标注 TBA |
| 图片素材获取困难 | W7 无素材 | 使用 AI 生成占位 + 游戏截图 |
| Node.js 14 升级 | Next.js 15 需求 | V3 内不升级框架版本 |
| 游戏延期上线 | 搜索量持续低迷 | 保持更新频率，占位等待 |
