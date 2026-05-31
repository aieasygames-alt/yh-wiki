# NTE Guide 互动地图 — 完整知识库

> 更新日期：2026-05-31（第二次更新：底图升级调研记录）
> 用途：作为互动地图开发、维护、升级的核心参考文档

---

## 一、技术栈概览

| 层面 | 技术 | 版本/备注 |
|------|------|-----------|
| 框架 | Next.js (App Router) | `output: 'export'` 静态导出模式 |
| 地图引擎 | Leaflet.js | `L.CRS.Simple`（简单坐标系） |
| 标记聚合 | leaflet.markercluster | maxClusterRadius: 50 |
| 搜索 | fuse.js | 权重: name(2) > description(1), 阈值 0.4 |
| 地图图片 | 瓦片方案 | `L.tileLayer` 加载 `{z}/{x}/{y}.webp` |
| 进度存储 | localStorage | key: `nte-map-progress`, `nte-map-filters` |
| 国际化 | 3 语言 (zh/tw/en) | `lib/i18n.ts` 的 `t()` 函数 |
| SSR 兼容 | dynamic import | `InteractiveMap` 通过 `dynamic(() => import(...), { ssr: false })` |
| 图片处理 | sharp | 瓦片生成脚本使用 |
| 测试 | vitest | `lib/__tests__/map-utils.test.ts` |

---

## 二、坐标系统

### 2.1 坐标系定义

- **CRS**: `L.CRS.Simple`（非地理坐标系）
- **Bounds**: `[[100, 0], [0, 100]]`（左上角 [100,0]，右下角 [0,100]）
- **坐标范围**: x/y 均为 0-100 的百分比坐标

### 2.2 坐标转换

原始游戏坐标到地图坐标的映射：
```
x = rawX / 4096 * 100    （左→右）
y = (4096 - rawY) / 4096 * 100  （上→下，Y轴翻转）
```

当前 `markerToLatLng` 直接返回 `[marker.x, marker.y]`（数据已预转换）。

### 2.3 测试中的坐标逻辑

测试文件 `map-utils.test.ts` 中有一个不同的转换：
```
latLng = [100 - marker.y, marker.x]
```
这与实际运行时的 `markerToLatLng` 行为不同（运行时直接用 `[x, y]`），需注意这一差异。

---

## 三、瓦片系统

### 3.1 源图

- **文件**: `public/images/maps/hethereau-full.webp`
- **尺寸**: 8192 x 8192 像素
- **大小**: ~336KB (WebP)
- **特征**: 已旋转 90° CCW

### 3.2 瓦片生成

**脚本**: `scripts/generate-map-tiles.js`

**参数**:
| 参数 | 值 |
|------|------|
| TILE_SIZE | 256px |
| MIN_ZOOM | 1 |
| MAX_ZOOM | 5 |
| 输出格式 | WebP (quality: 80) |

**瓦片金字塔**:
```
z=1:  2x2   = 4 张    (512px total)
z=2:  4x4   = 16 张   (1024px total)
z=3:  8x8   = 64 张   (2048px total)
z=4:  16x16 = 256 张  (4096px total)
z=5:  32x32 = 1024 张 (8192px total)
───────────────────────
总计: 1364 张瓦片
```

**输出路径**: `public/images/maps/tiles/{z}/{x}/{y}.webp`

### 3.3 瓦片加载逻辑

`InteractiveMap.tsx` 中的判断：
```typescript
if (map.image.includes("{z}")) {
  // 瓦片模式
  L.tileLayer(map.image, { minZoom, maxZoom, bounds, noWrap: true }).addTo(map);
} else {
  // 单图模式（向后兼容）
  L.imageOverlay(map.image, bounds, { interactive: false }).addTo(map);
}
```

当前 `map-core.json` 中 image 为 `/images/maps/tiles/{z}/{x}/{y}.webp`，使用瓦片模式。

---

## 四、数据架构

### 4.1 数据文件一览

| 文件 | 用途 | 大小 |
|------|------|------|
| `data/map-markers.json` | 源数据（全部标记，构建时使用） | 2.4MB |
| `public/data/map-core.json` | 运行时核心数据（markerTypes + regions + map 元数据） | ~12KB |
| `public/data/map-markers-{region}.json` | 按区域拆分的标记数据 | 66-471KB |
| `public/data/map-regions.json` | 区域 ID 列表索引 | 极小 |

### 4.2 数据拆分流程

`scripts/split-map-data.py` → `data/map-markers.json` 拆分为:
1. `map-core.json` — maps 元数据 + markerTypes + regions（无 markers 数组）
2. 5 个区域标记文件 — 按 `marker.region` 字段分组

### 4.3 核心数据结构

#### MapMarker（标记点）

```typescript
interface MapMarker {
  id: string;                  // 唯一标识，如 "zlv2-fast-travel-xxx"
  name: string;                // 中文名
  nameEn: string;              // 英文名
  type: string;                // 标记类型 ID（对应 markerTypes key）
  subtype?: string;            // 子类型
  x: number;                   // X 坐标 (0-100)
  y: number;                   // Y 坐标 (0-100)
  description?: string;        // 中文描述
  descriptionEn?: string;      // 英文描述
  relatedMaterials?: string[]; // 关联材料 ID
  image?: string;              // 标记截图 URL
  guideUrl?: string;           // 攻略链接
  respawn?: "once" | "daily" | "weekly";  // 刷新类型
  region?: string;             // 区域 ID
  floor?: number;              // 楼层（多层地图用，当前未使用）
  rarity?: 1 | 2 | 3 | 4;     // 稀有度
  verified?: boolean;          // 是否已验证
  icon?: string;               // 自定义标记图标路径
  link?: string;               // 外部参考链接
  noteTitle?: string;          // 备注标题
  noteTitleEn?: string;        // 英文备注标题
  primaryColor?: string;       // 主色调
}
```

#### MarkerTypeInfo（标记类型定义）

```typescript
interface MarkerTypeInfo {
  color: string;     // 标记颜色（hex，如 "#ef4444"）
  label: string;     // 中文标签
  labelEn: string;   // 英文标签
  icon?: string;     // 类型图标
  subtypes?: Record<string, { label: string; labelEn: string }>;
}
```

#### MapInfo（地图定义）

```typescript
interface MapInfo {
  id: string;                              // "hethereau"
  name: string;                            // "海瑟劳"
  nameEn: string;                          // "Hethereau"
  image: string;                           // 瓦片路径模板或单图路径
  description: string;
  descriptionEn: string;
  minZoom: number;                         // 1
  maxZoom: number;                         // 5
  bounds: [[number, number], [number, number]];  // [[100,0],[0,100]]
  markers: MapMarker[];                    // 空数组（运行时按需加载）
}
```

#### RegionInfo（区域定义）

```typescript
interface RegionInfo {
  zh: string;    // "新赫兰德"
  en: string;    // "New Herland"
  color: string; // "#3b82f6"
}
```

### 4.4 当前数据统计

**总计**: 5,677 个标记，18 种标记类型，166 个子类型，5 个区域

**按区域分布**:
| 区域 ID | 中文名 | 英文名 | 标记数 |
|---------|--------|--------|--------|
| new-herland | 新赫兰德 | New Herland | 1,659 |
| illusion-town | 幻镇 | Illusion Town | 1,408 |
| miguel-district | 米格尔区 | Miguel District | 1,367 |
| bridge-crossings | 桥间地 | Bridge Crossings | 1,044 |
| unheard-shores | 未闻浦 | Unheard Shores | 194 |
| （无区域） | — | — | 5 |

**按类型分布**:
| 类型 ID | 中文名 | 标记数 |
|---------|--------|--------|
| mystery-box | 神秘箱 | 966 |
| currency | 货币与战利品 | 964 |
| monster | 怪物 | 712 |
| shop | 商家 | 677 |
| collectible | 收集品 | 641 |
| viewpoint | 景点 | 495 |
| quest | 任务 | 321 |
| oracle-stone | 谕石 | 258 |
| service | 城市服务 | 129 |
| activity | 活动 | 123 |
| gift-21 | 「21」的赠礼 | 112 |
| chest | 宝箱 | 109 |
| waypoint | 传送 | 100 |
| arc-plate | 弧盘 | 27 |
| phone-booth | 电话亭 | 17 |
| boss | 世界BOSS | 13 |
| region | 地区 | 7 |
| tower | 维特海默之塔 | 6 |

### 4.5 标记类型完整定义（18 种）

```json
{
  "waypoint":     { "color": "#eab308", "label": "传送",       "labelEn": "Fast Travel" },
  "phone-booth":  { "color": "#06b6d4", "label": "电话亭",     "labelEn": "Phone Booth" },
  "tower":        { "color": "#f59e0b", "label": "维特海默之塔", "labelEn": "Wertheimer Tower" },
  "collectible":  { "color": "#22c55e", "label": "收集品",     "labelEn": "Collectibles" },
  "oracle-stone": { "color": "#a78bfa", "label": "谕石",       "labelEn": "Oracle Stone" },
  "chest":        { "color": "#f59e0b", "label": "宝箱",       "labelEn": "Treasure Box" },
  "quest":        { "color": "#3b82f6", "label": "任务",       "labelEn": "Quests" },
  "boss":         { "color": "#ef4444", "label": "世界BOSS",   "labelEn": "World Boss" },
  "arc-plate":    { "color": "#8b5cf6", "label": "弧盘",       "labelEn": "Arc Plate" },
  "gift-21":      { "color": "#f472b6", "label": "「21」的赠礼", "labelEn": "Gift from \"21\"" },
  "currency":     { "color": "#facc15", "label": "货币与战利品", "labelEn": "Currencies & Loot" },
  "mystery-box":  { "color": "#7c3aed", "label": "神秘箱",     "labelEn": "Mystery Box" },
  "activity":     { "color": "#ec4899", "label": "活动",       "labelEn": "Activities" },
  "monster":      { "color": "#dc2626", "label": "怪物",       "labelEn": "Monsters" },
  "service":      { "color": "#14b8a6", "label": "城市服务",   "labelEn": "City Services" },
  "shop":         { "color": "#06b6d4", "label": "商家",       "labelEn": "Featured Business" },
  "viewpoint":    { "color": "#06b8d4", "label": "景点",       "labelEn": "Locations" },
  "region":       { "color": "#6b7280", "label": "地区",       "labelEn": "Region" }
}
```

### 4.6 图标资源

- **目录**: `public/images/map/icons/`
- **数量**: 150 个 WebP 图标文件
- **用途**: 作为 `MapMarker.icon` 字段的值，替代默认彩色圆点

---

## 五、代码结构详解

### 5.1 页面路由

| 路由 | 文件 | 渲染模式 | 说明 |
|------|------|----------|------|
| `/[lang]/map` | `app/[lang]/map/page.tsx` | CSR | 主互动地图页面 |
| `/[lang]/map` layout | `app/[lang]/map/layout.tsx` | SSR | SEO metadata (title/description/OG/hreflang) |
| `/[lang]/map/region/[region]` | `app/[lang]/map/region/[region]/page.tsx` | SSG (force-static) | 区域攻略页 |
| `/[lang]/map/region/[region]` client | `app/[lang]/map/region/[region]/RegionGuideClient.tsx` | CSR | 区域页客户端组件 |

### 5.2 组件清单

#### InteractiveMap (`components/InteractiveMap.tsx`)

**核心职责**: Leaflet 地图渲染

**功能**:
- 初始化 Leaflet 地图（CRS.Simple）
- 瓦片/单图自动切换
- 标记聚合（markercluster，紫色数字气泡）
- 标记增量更新（筛选变化时仅更新样式，集合变化时全量重建）
- 路线折线绘制（`L.polyline`，紫色虚线）
- 选中标记自动平移（`flyTo`）
- 自定义聚合图标（圆形紫色数字）

**Props**:
```typescript
{
  map: MapInfo;
  markers: MapMarker[];
  markerTypes: Record<string, MarkerTypeInfo>;
  selectedMarker: MapMarker | null;
  onSelectMarker: (marker: MapMarker | null) => void;
  progress: ProgressMap;
  lang: string;
  routeMarkerIds?: string[];
}
```

**性能优化**:
- 使用 `renderedRef` 跟踪已渲染标记，避免全量重建
- `prevMarkerIdsRef` 检测标记集合是否变化，未变化时只更新样式
- 标记聚合自动处理密集标记

#### MapSidebar (`components/MapSidebar.tsx`)

**核心职责**: 左侧分类树 + 标记列表

**功能**:
- 按标记类型分组显示
- 全选/全不选按钮
- 分类折叠/展开
- 子标记列表（已收集排后面，限制显示 30 个，可展开全部）
- 每个类型显示收集进度（已收集/总数）
- 标记项显示刷新类型标签

#### MapMarkerDetail (`components/MapMarkerDetail.tsx`)

**核心职责**: 标记详情面板

**功能**:
- 类型徽章 + 稀有度标签 + 刷新标签
- 标记截图显示
- 名称 + 描述（双语）
- 坐标复制到剪贴板
- 关联材料链接（链接到材料详情页）
- 攻略链接
- 附近标记推荐（距离计算，最多 5 个）
- 收集/取消收集按钮
- 添加到路线按钮

#### MapSearch (`components/MapSearch.tsx`)

**核心职责**: fuse.js 模糊搜索

**功能**:
- 搜索字段权重: name(2), nameEn(2), noteTitle(1.5), noteTitleEn(1.5), description(1), descriptionEn(1)
- 阈值 0.4（较宽松匹配）
- 结果限制 10 条
- Fuse 实例缓存（避免重复构建）
- 下拉结果面板

#### MapProgressBar (`components/MapProgressBar.tsx`)

**核心职责**: 收集进度条

**功能**: 显示已收集/总数 + 百分比进度条

#### MapRoutePlanner (`components/MapRoutePlanner.tsx`)

**核心职责**: 路线规划

**功能**:
- 最近邻 TSP 优化（`optimizeOrder`）
- 路线列表（可删除单个点）
- 总距离计算
- 路线优化按钮
- 路线分享（URL 参数 `?route=id1,id2,id3`）
- 清空路线

#### ExplorerSweepMap (`components/ExplorerSweepMap.tsx`)

**核心职责**: 探索伴侣模式的简化地图

**功能**:
- 编号标记（1, 2, 3...）
- 已收集显示 ✓ + 绿色
- 活跃标记脉冲动画
- 路线折线
- 自动适配边界到标记范围
- 点击标记回调

### 5.3 库/工具模块

#### map-utils.ts (`lib/map-utils.ts`)

**导出**:
- 类型: `MapMarker`, `MarkerTypeInfo`, `RegionInfo`, `MapInfo`, `ProgressMap`, `LatLngTuple`, `RespawnType`, `MarkerRarity`
- 常量: `DEFAULT_BOUNDS`
- 函数: `markerToLatLng()`, `getMapBounds()`, `createMarkerIcon()`

**createMarkerIcon 工厂**:
- 尺寸: 未选中 24px，选中 32px
- 已收集: opacity 0.35 + ✓ SVG 覆盖
- 选中状态: 外圈 ring
- 支持自定义图标图片（`iconUrl` 参数）

#### map-progress.ts (`lib/map-progress.ts`)

**存储 Keys**:
| Key | 存储内容 |
|-----|----------|
| `nte-map-progress` | 收集进度 (`Record<string, boolean>`) |
| `nte-map-filters` | 筛选状态 (`string[]`) |
| `nte-explorer-sweep-filters` | 探索伴侣筛选 (`{ region, types }`) |
| `nte-explorer-player-info` | 玩家信息 (`{ nickname, playerId }`) |

**导出函数**:
- `loadProgress()`, `saveProgress()`, `toggleMarker()`, `countCollected()`, `progressPercent()`, `clearProgress()`
- `loadFilters()`, `saveFilters()`
- `loadSweepFilters()`, `saveSweepFilters()`
- `loadPlayerInfo()`, `savePlayerInfo()`

#### use-map-data.ts (`lib/use-map-data.ts`)

**导出 Hooks**:

**`useMapData()`**: 加载核心数据
- 获取 `map-core.json`（markerTypes + regions + map 元数据）
- 模块级缓存 `cachedCore`（避免重复请求）
- 返回 `{ maps, markerTypes, regions, loading, error }`

**`useRegionMarkers(regionId, allRegionIds)`**: 按区域加载标记
- 单区域模式: 只获取对应区域 JSON
- 全区域模式: 并行获取所有区域 JSON
- 模块级缓存 `markerCache`（避免重复请求）
- 返回 `{ markers, loading }`

### 5.4 脚本

#### generate-map-tiles.js

```bash
node scripts/generate-map-tiles.js                    # 默认 hethereau-full.webp
node scripts/generate-map-tiles.js path/to/map.webp   # 自定义源图
```

- 输入: 任意尺寸的 WebP/PNG 源图
- 输出: `public/images/maps/tiles/{z}/{x}/{y}.webp`
- 使用 sharp 库进行图片处理
- 每个缩放级别独立 resize 后切片

#### split-map-data.py

```bash
python3 scripts/split-map-data.py
```

- 输入: `data/map-markers.json`
- 输出: `public/data/map-core.json` + 5 个区域标记文件 + `map-regions.json`

---

## 六、主页面工作流 (`app/[lang]/map/page.tsx`)

### 6.1 状态管理

```typescript
const [activeMap, setActiveMap] = useState(0);            // 当前地图索引
const [activeFilters, setActiveFilters] = useState<Set<string>>();  // 筛选类型
const [activeRegion, setActiveRegion] = useState<string>();          // 区域筛选
const [selectedMarker, setSelectedMarker] = useState<MapMarker>();   // 选中标记
const [progress, setProgress] = useState<ProgressMap>();             // 收集进度
const [sidebarOpen, setSidebarOpen] = useState(true);                // 侧边栏
const [isFullscreen, setIsFullscreen] = useState(false);             // 全屏
const [hideCollected, setHideCollected] = useState(false);           // 隐藏已收集
const [routeMarkerIds, setRouteMarkerIds] = useState<string[]>();    // 路线标记
```

### 6.2 数据加载

```
mount → useMapData() → fetch map-core.json → 激活筛选
mount → useRegionMarkers(null, allRegionIds) → 并行加载所有区域标记
mount → loadProgress() → 从 localStorage 恢复收集进度
mount → parse URL params → 恢复路线和深层链接标记
```

### 6.3 标记过滤流程

```
allMarkers
  → filter by activeFilters (类型筛选)
  → filter by hideCollected (隐藏已收集)
  → filter by activeRegion (区域筛选)
  → filteredMarkers
```

### 6.4 URL 深层链接

| 参数 | 用途 | 示例 |
|------|------|------|
| `?marker=xxx` | 选中指定标记 | `?marker=zlv2-boss-001` |
| `?route=id1,id2,id3` | 加载路线 | `?route=abc,def,ghi` |

选中标记时自动通过 `history.replaceState` 更新 URL。

### 6.5 SEO

- **Layout**: SSR 生成 title/description/OpenGraph/hreflang
- **JSON-LD**: `WebApplication` + `VideoGame` 结构化数据
- **SEO 文本**: 地图下方显示描述性文本（全屏时隐藏）

---

## 七、区域攻略页

### 7.1 路由

`/[lang]/map/region/[region]` — 5 个区域 × 3 语言 = 15 个静态页面

### 7.2 渲染模式

`force-static` — 通过 `generateStaticParams` 在构建时生成

### 7.3 SEO

每个区域有独立的 title、description、OG 标签（硬编码在 page.tsx 中）。

---

## 八、构建流程

```bash
# 1. 编辑源数据
vim data/map-markers.json

# 2. 拆分数据（生成运行时 JSON）
python3 scripts/split-map-data.py

# 3. 生成瓦片（如需更新底图）
node scripts/generate-map-tiles.js

# 4. 运行测试
npx vitest run

# 5. 构建
npm run build

# 6. 预览
npm run start
```

---

## 九、测试

**文件**: `lib/__tests__/map-utils.test.ts`

**测试覆盖**:
- `markerToLatLng` 坐标转换
- `getMarkerIconSize` 图标尺寸
- `buildMarkerIconHtml` 图标 HTML 生成
- 数据完整性:
  - 至少 1 张地图
  - 每张地图有必需字段
  - 标记坐标在 0-100 范围
  - 标记引用有效类型
  - 无重复 ID
  - 双语名称存在
  - 核心类型存在 (boss, collectible, waypoint, chest)
  - 扩展类型存在 (viewpoint, oracle-stone, quest, region)
  - 至少 4800 个标记
  - 颜色为有效 hex

---

## 十、竞品对比

| 功能 | 我们 | InteractiveMap.app | Game8 | GameWith | ghzs666 |
|------|------|-------------------|-------|----------|---------|
| 分类筛选 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 进度追踪 | ✅ | ✅ | ❌ | ✅ | ✅ |
| 模糊搜索 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 标记聚合 | ✅ | ✅ | ❌ | ❌ | ❌ |
| 全屏模式 | ✅ | ✅ | ❌ | ✅ | ✅ |
| 附近标记 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 坐标复制 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 路线规划 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 云端同步 | ❌ | ✅ | ❌ | ❌ | ❌ |
| 标记数量 | 4,807 | 4,000+ | 完整 | 完整 | 综合覆盖 |
| 多语言 | 3 语 | 13 语 | 2 语 | 2 语 | 中 |

**核心优势**: 聚合、附近标记、坐标复制、路线规划
**核心差距**: 云端同步、标记截图数据、攻略链接数据、未闻浦标记不足

---

## 十一、外部数据源参考

### 11.1 ghzs666（推荐）

- **地址**: https://www.ghzs666.com/nte-map
- **特点**: 国内最流行的 NTE 地图，长期维护
- **瓦片格式**: `https://xxx/tiles/{z}/{x}/{y}.jpg` 或 `.webp`
- **数据来源**: CBT + 正式服更新

### 11.2 InteractiveMap.app

- **地址**: https://interactivemap.app/neverness-to-everness/maps/hethereau
- **特点**: 4000+ Marker，官方图标，免费使用
- **瓦片格式**: `tiles/5/17/23.webp` 或 `hethereau_full.webp`
- **标记数据**: 大量 POI，可作为参考

### 11.3 ZeroLuck

- **地址**: https://zeroluck.gg/nte/interactive-map/
- **特点**: React 前端，路线功能成熟
- **数据格式**: markers.json / areas.json / icons.json

---

## 十二、当前开发状态

### 12.1 已完成功能

- [x] 瓦片地图渲染
- [x] 标记聚合
- [x] 18 种标记类型
- [x] 5 区域筛选
- [x] 收集进度追踪（localStorage）
- [x] 筛选状态持久化
- [x] 隐藏已收集标记
- [x] 模糊搜索
- [x] 树形分类面板
- [x] 标记详情（坐标/稀有度/附近/材料）
- [x] 路线规划（最近邻优化 + URL 分享）
- [x] 全屏模式
- [x] 移动端底部 Sheet
- [x] i18n 三语
- [x] 按需加载（区域标记懒加载）
- [x] 区域攻略页（SSG）
- [x] JSON-LD 结构化数据
- [x] 标记深层链接
- [x] 探索伴侣模式
- [x] 底图升级调研（ghzs666 瓦片已下载，暂缓实施）
- [x] 标记数据扩充（4,807 → 5,677，新增 870 个 IMapp 标记）
- [x] 新增 subtype：钓鱼点(fishing)、A.R.P.T.S、Mr. Brown、V.i.B 等 5 个
- [x] ZeroLuck 精确仿射变换校准（5 个塔标定点，最大误差 0.5 单位）

### 12.2 底图升级调研记录（2026-05-31）

**目标**: 将底图从 8192px 升级到 16384px

**已完成**:
- 从 ghzs666 下载了完整的 16384px 瓦片（4096 张 z=7 WebP 瓦片），存于 `tmp/ghzs666-tiles/`
- 拼接为完整底图 `tmp/ghzs666-full.png`（16384x16384，7.7MB）
- 裁剪为内容区域后填充正方形：`public/images/maps/hethereau-full-hd.png`（13824x13824，7.5MB）
- 使用新底图生成了 z=1..6 瓦片（5460 张，21MB）

**暂缓原因**:
ghzs666 坐标系与我们的坐标系存在非线性偏移：
- 我们: bounds `[[100,0],[0,100]]`，内容中心约 (50, 54)
- ghzs666: bounds `[[-256,256],[256,-256]]`，瓦片仅 0..63 范围有内容（半张图）
- 坐标映射公式 `ghzsX = -4.7887 * ourX + 241.53` 不够精确
- 实测：我们的标记点 (50,50) 映射到 ghzs666 瓦片网格 (64.5, 65.8)，超出有内容的 0..63 范围
- 结果：标记点全部落在黑色区域，地图和标记无法对齐

**后续路径**:
1. 用已知标记点（传送点/BOSS）做精确的仿射变换校准
2. 或从游戏客户端直接提取底图（避免坐标系问题）
3. 或保持当前 8192px 底图，优先做标记数据补充

**保留文件**:
```
tmp/ghzs666-tiles/           — 原始瓦片（4096 张 WebP）
tmp/ghzs666-full.png         — 拼接的完整底图（16384x16384）
public/images/maps/hethereau-full-hd.png — 裁剪后的 PNG 源图（13824x13824）
tmp/coordinate-mapping.json  — 坐标映射（基于 5 个区域质心）
tmp/imapp-coordinate-mapping.json — IMapp 坐标映射
```

### 12.3 待完成功能（按优先级）

**P0 — 数据质量**:
- [x] 未闻浦标记补充（验证：192→194 已接近完整，该区域较小）
- [x] 标记数据扩充（IMapp 补充 870 个新标记，总计 5,677）
- [ ] 标记截图填充
- [ ] 攻略链接填充
- [ ] 标记验证状态更新
- [ ] 228 个未分配区域标记的处理

**P1 — 1.1 版本适配**:
- [ ] 底图升级（解决坐标系对齐后重新切片，见 12.2）
- [ ] 新区域标记数据采集（向阳岛/噗咔乐园/半港区，ghzs666 已有数据）
- [ ] 新标记类型（出租车停靠点、钓鱼点、POI-DT 等）
- [ ] 多地图切换（当前仅海瑟劳）

**P2 — 功能增强**:
- [ ] 云端进度同步
- [ ] 社区贡献机制
- [ ] PWA 离线支持
- [ ] 计算器联动
- [ ] 楼层/多层地图支持

### 12.4 竞品数据已采集状态

| 数据源 | 文件 | 标记数 | 特点 |
|--------|------|--------|------|
| InteractiveMap.app | `tmp/imapp-markers.json` | 4,796 | 14 组 128 分类，完整 REST API |
| ghzs666 | `tmp/ghzs666-markers.json` | 1,028 | 4 组，含 8 区域（含向阳岛等新区域） |
| ghzs666 areas | `tmp/ghzs666-areas.json` | 8 区域 | 含新赫兰德/桥间地/幻镇/未闻浦/米格尔 + 向阳岛/噗咔乐园/半港区 |

**数据重叠分析**: 我们 4,807 个标记与 IMapp 4,796 个标记基本是同一批数据的不同 ID 表示（IMapp 用数字 ID，我们用 zlv2-/dt-/nte- 前缀）。需通过坐标接近度匹配，非直接 ID 关联。

### 12.5 开发路线图（feature-roadmap.md）

- **Week 3 (6/2-6/8)**: Task 5 地图扩充 + Task 6 移动端优化
- **Week 4 (6/9-6/15)**: Task 7 任务攻略

---

## 十三、关键文件索引

```
yh-wiki/
├── app/[lang]/map/
│   ├── layout.tsx                          # SEO metadata
│   ├── page.tsx                            # 主地图页面（CSR）
│   └── region/[region]/
│       ├── page.tsx                        # 区域攻略页（SSG）
│       └── RegionGuideClient.tsx           # 区域页客户端
├── components/
│   ├── InteractiveMap.tsx                  # 地图渲染核心
│   ├── MapSidebar.tsx                      # 侧边栏分类树
│   ├── MapMarkerDetail.tsx                 # 标记详情
│   ├── MapSearch.tsx                       # 搜索
│   ├── MapProgressBar.tsx                  # 进度条
│   ├── MapRoutePlanner.tsx                 # 路线规划
│   └── ExplorerSweepMap.tsx               # 探索伴侣地图
├── lib/
│   ├── map-utils.ts                        # 类型定义 + 坐标 + 图标
│   ├── map-progress.ts                     # localStorage 持久化
│   ├── use-map-data.ts                     # React hooks
│   └── __tests__/map-utils.test.ts         # 测试
├── data/
│   └── map-markers.json                    # 源数据（全部标记）
├── public/
│   ├── data/
│   │   ├── map-core.json                   # 运行时核心数据
│   │   ├── map-markers-{region}.json       # 区域标记
│   │   └── map-regions.json                # 区域索引
│   └── images/
│       ├── maps/
│       │   ├── hethereau-full.webp         # 源图 (8192x8192)
│       │   ├── tiles/{z}/{x}/{y}.webp      # 瓦片 (1364 张)
│       │   └── regions/*.webp              # 区域缩略图
│       └── map/icons/*.webp                # 标记图标 (150 个)
├── scripts/
│   ├── generate-map-tiles.js               # 瓦片生成
│   └── split-map-data.py                   # 数据拆分
└── docs/
    ├── 互动地图竞品分析报告.md
    ├── 地图功能升级-V2需求文档.md
    └── PRD-互动地图升级计划.md
```
