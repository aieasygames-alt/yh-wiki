# NTE 互动地图升级方案 — 竞品数据源调研

> 日期：2026-05-31
> 基于 ChatGPT 建议的三个数据源深度技术调研
>
> 更新记录：2026-05-31 底图升级实际验证结果（见第七节）

---

## 一、竞品技术实现对比

### 1.1 ghzs666 (ghzs666.com/nte-map) ⭐ 最佳底图源

| 维度 | 详情 |
|------|------|
| **技术栈** | Vue 2 + Vant UI + **Leaflet 1.8.0** |
| **坐标系统** | `L.CRS.Simple`，bounds `[[-256, -256], [256, 256]]` |
| **瓦片格式** | **标准 XYZ 瓦片**，WebP 格式，TMS 模式（Y 轴翻转） |
| **瓦片缩放** | Leaflet zoom 0-6（URL zoom 1-7），最大 **16384×16384px** |
| **标记数据** | **公开 JSON REST API**（`api-wiki-game.ghzs.com`） |
| **多语言** | 支持中/英/俄/西/印尼/法/韩/德 8 种语言 |
| **账号系统** | 有，支持云端同步标点数据 |
| **路线功能** | 有推荐路线和自定义路线 |
| **区域数据** | 8 个区域（含向阳岛、噗咔乐园、半港区等） |
| **可提取性** | ⭐⭐⭐⭐⭐ 最佳 — 标准 Leaflet 瓦片 + 公开 API |

**关键 API 端点**（全部公开，无需认证）:

```bash
# 地图资源数据（所有标记点，按分组返回）
GET https://api-wiki-game.ghzs.com/v1d0/web/wanmei-yh/map

# 区域数据（8 个区域）
GET https://api-wiki-game.ghzs.com/v1d0/web/wanmei-yh/map/areas

# 标准瓦片 URL（16384x16384，7 级缩放，WebP）
https://and-static.ghzs.com/web/yihuan-map-260528/{z}/{x}/{y}.webp
# z: 1-7 (URL zoom = Leaflet zoom + 1)
# TMS 模式: tms: true (Y 轴翻转)
# tileSize: 256px
# 注意: 260528 是版本号（2026-05-28），会随更新变化

# 标记图标
https://static.ghzs666.com/game-wiki/images/{icon_path}
```

**标记数据格式**:
```json
{
  "group_name": "探索度/Progress",
  "group_name_en": "Progress",
  "resources": [{
    "_id": "...",
    "name": "谕石",
    "name_en": "Oracle Stone",
    "icon_url": "https://static.ghzs666.com/game-wiki/images/...",
    "points": [{
      "_id": "...",
      "coordinates": [lng, lat],
      "area": "bridge-crossings"
    }]
  }]
}
```

**CSS 增强**: 底图应用了 `filter: brightness(1.6) contrast(1.1)` 提升亮度

**特点**:
- **同为 Leaflet + CRS.Simple** — 与我们技术栈完全一致，坐标转换最简单
- **最高分辨率底图** — 16384×16384px（比我们现有的 8192×8192 高一倍）
- 底图版本化管理，每次游戏更新会更换版本号
- 8 个区域（比我们多 3 个：向阳岛、噗咔乐园、半港区）
- 阿里云 CDN 托管，国内访问速度快

### 1.2 InteractiveMap.app ⭐ 最佳瓦片源

| 维度 | 详情 |
|------|------|
| **技术栈** | React (CRA) + Leaflet.js + **PIXI.js**（WebGL 标记渲染） |
| **渲染器** | Leaflet 地图 + PIXI.js WebGL 标记层（高性能） |
| **瓦片格式** | 标准 XYZ 瓦片，JPEG 格式，缩放 0-7 级 |
| **标记数据** | **公开 REST API**，一次性返回全部 4000+ 标记 |
| **多语言** | 13 种语言 |
| **标记存储** | JSON API (`/api/{map_id}/options.json`)，GeoJSON-like 格式 |
| **可提取性** | ⭐⭐⭐⭐⭐ 最佳 — 完整公开 API，无需认证 |

**关键 API 端点**（全部公开，无需认证）:

```bash
# 获取所有地图列表
GET https://interactivemap.app/neverness-to-everness/maps/imapp/api/getmaps

# 获取完整标记数据（4000+ 标记，一次返回）
GET https://interactivemap.app/neverness-to-everness/maps/imapp/api/1/options.json

# 瓦片 URL 格式（标准 XYZ）
https://interactivemap.app/neverness-to-everness/maps/imapp/uploads/tiles/nte-10/{z}_{x}_{y}.jpg
# 缩放级别: 0-7，地图缩放范围: 2-9

# 其他有用端点:
GET /api/getTranslations        — 翻译数据
GET /api/getTooltips            — 工具提示
GET /api/map_areas/{map_id}     — 区域数据
GET /api/searchMarkers?query=xx — 搜索标记
GET /api/version/{map_id}       — 版本号
```

**标记数据格式**（GeoJSON-like）:
```json
{
  "groups": [{
    "categories": [{
      "data": [{
        "type": "Point",
        "coordinates": [x, y],
        "properties": {
          "id": "...",
          "note_title": "...",
          "icon_image": "...",
          "icon_size": [...],
          "primary_color": "..."
        }
      }]
    }]
  }]
}
```

**注意**: 该站 `robots.txt` 屏蔽了 AI 爬虫（GPTBot/ClaudeBot 等），数据仅供参考

### 1.3 ZeroLuck (zeroluck.gg/nte/interactive-map/) ⭐ 最佳数据源

| 维度 | 详情 |
|------|------|
| **技术栈** | Next.js (React) + 自研 Canvas 渲染器 |
| **渲染器** | `image-grid`（43 列 × 44 行 = 1804 tiles） |
| **瓦片格式** | 256x256 PNG，CDN 托管在 `cdn-zeroluck-gg.b-cdn.net` |
| **投影** | `affine-2d`：x=[0.01639, 0, 664.43], y=[0, -0.01639, 2154.76] |
| **标记数据** | **公开 JSON API** |
| **多语言** | 多语言支持（en/zh 等） |
| **可提取性** | ⭐⭐⭐⭐⭐ 最佳 — 数据完全公开可获取 |

**关键数据端点**:

```bash
# 地图瓦片（430 张，每张 256x256 PNG，来自游戏 MiniMap 原始资源）
# URL 格式:
https://cdn-zeroluck-gg.b-cdn.net/nte/Assets/UI/UI/MiniMap/bigworldmap/map_bigworld_{NNNNN}.png

# 地图元数据（tile grid 定义，投影参数，430 个瓦片坐标+bounds）
# 嵌入在页面的 __NEXT_DATA__ 的 initialPayload.map 中

# 初始标记（448 个核心标记：传送点、谕石等高频分类）
https://zeroluck.gg/nte/data/interactive-map/starter-markers.en.json

# 按分类加载完整标记（无需认证）:
https://zeroluck.gg/nte/data/interactive-map/categories/{categoryId}.en.json
# 已确认可用的分类端点:
#   fast-travel.en.json      (~114 标记)  快速传送点
#   stealable-loot.en.json   (663 标记)   可窃取物品
#   monsters.en.json         (552 标记)   怪物
#   featured-business.en.json (~601 标记)  商店和餐厅
#   以及其他 12 个分类...

# 区域数据（6 个区域）+ 分类定义（16 个分类）
# 嵌入在 __NEXT_DATA__ 的 initialPayload 中

# 需认证的 API:
#   GET  /api/profile/interactive-map-saves           — 获取用户地图存档
#   POST /api/profile/interactive-map-save/toggle     — 切换标记完成状态
#   GET  /api/community/map-routes/detail?slug={slug} — 社区路线详情
```

**标记数据结构**（ZeroLuck）:
```json
{
  "id": "fast-travel:WertheimerTower_001",
  "title": "Wertheimer Tower",
  "categoryId": "fast-travel",
  "regionId": "area-001",
  "icon_url": "https://cdn-zeroluck-gg.b-cdn.net/nte/Assets/UI/UI/MiniMap/minimapicon/YH_UI_map_icon3.png",
  "position": {
    "map": { "x": -889.98, "y": -556.2 }
  },
  "entityId": "fast-travel-...",
  ...
}
```

**瓦片参数**:
- Grid: 41 cols × 44 rows = 1804 tiles（实际 430 个有内容的 tile）
- Tile size: 256px
- Bounds: minX=-5632, maxX=4864, minY=-5632, maxY=5632
- 投影: affine-2d（游戏坐标 → 地图像素坐标的线性变换）

---

## 二、升级方案建议

### 方案 A：混合方案 — ghzs666 底图 + InteractiveMap.app 标记数据（最推荐）

**底图来源**: ghzs666
- **同为 Leaflet + CRS.Simple** — 坐标系完全一致，零转换成本
- **16384×16384px** — 比我们现有 8192×8192 高一倍
- **国内阿里云 CDN** — 访问速度快
- **版本化管理** — `yihuan-map-{version}` 路径，随游戏更新
- **8 个区域** — 比我们多 3 个（向阳岛、噗咔乐园、半港区）

**标记数据来源**: InteractiveMap.app
- **完整 REST API** — `/api/1/options.json` 一次性返回 4000+ 标记
- **128 个分类** — 分类最细最全
- **GeoJSON 格式** — 易于解析和转换

**步骤**:
1. 从 ghzs666 获取瓦片配置（bounds、zoom 范围等）
2. 从 IMapp `/api/1/options.json` 获取完整标记数据
3. 建立坐标映射（IMapp 坐标 → ghzs666/我们的坐标系）
4. 下载 ghzs666 瓦片到本地，重新切片或直接配置 Leaflet 指向
5. 更新 `data/map-markers.json`

**坐标转换**:
- ghzs666: bounds `[[-256, -256], [256, 256]]`，CRS.Simple
- 我们: bounds `[[100, 0], [0, 100]]`，CRS.Simple
- 转换: 简单线性映射，只需确定缩放和偏移

### 方案 B：从 ZeroLuck 获取底图瓦片 + 分类标记数据

**优势**:
- 瓦片来自游戏客户端原始 MiniMap 资源
- 按分类的标记数据（16 个分类端点，无需认证）
- 标记数据有 grade（稀有度）等额外字段

**劣势**:
- 非标准瓦片格式（41×44 网格 + affine-2d 投影）
- 需要额外坐标转换（更复杂）
- 只有 448 个初始标记 + 按分类的额外标记

### 方案 C：从游戏客户端提取底图

（同上，保留不变）

### 方案 D：保留现有底图，仅补充标记数据

（同上，保留不变）

---

## 二.一、数据源技术对比总结

| 维度 | ghzs666 | InteractiveMap.app | ZeroLuck |
|------|---------|-------------------|----------|
| 地图引擎 | **Leaflet 1.8.0** | **Leaflet.js + PIXI.js** | 自研 Canvas (image-grid) |
| 瓦片格式 | **标准 XYZ** (TMS) | **标准 XYZ** | 41×44 网格 |
| 瓦片图片 | WebP, 16384×16384px | JPEG | PNG, 256px |
| 瓦片缩放级别 | **1-7**（7级，最高分辨率） | **0-7**（8级） | 单层（430 tiles） |
| 标记数据 | **公开 JSON REST API** | **公开 REST API** | 公开静态 JSON |
| 标记获取方式 | `/web/wanmei-yh/map` | `/api/1/options.json` | `categories/{id}.en.json` |
| 坐标系 | **Leaflet CRS.Simple** | **Leaflet CRS.Simple** | affine-2d |
| 与我们兼容性 | **最佳**（同为 Leaflet + CRS.Simple） | **最佳**（同为 Leaflet） | 中等（需投影转换） |
| 区域数量 | **8 个**（最全） | 未知 | 6 个 |
| 底图版本化 | ✅ 有（日期版本号） | 未知 | 未知 |
| 国内访问 | ✅ 阿里云 CDN（快） | Cloudflare（中等） | Bunny CDN（中等） |

**结论**: **ghzs666 是底图最佳来源**（同为 Leaflet + CRS.Simple、最高分辨率、国内 CDN 快），**InteractiveMap.app 是标记数据最佳来源**（完整 API、128 类分类）

---

## 三、坐标转换研究

### ZeroLuck 的坐标系统

ZeroLuck 使用 **affine-2d 投影**:
```
mapX = 0.01639 * gameX + 0 * gameY + 664.43
mapY = 0 * gameX + (-0.01639) * gameY + 2154.76
```

这意味着：
- 游戏坐标到地图像素是线性变换
- X 轴缩放因子 0.01639，Y 轴缩放因子 -0.01639（Y 翻转）
- 偏移量：(664.43, 2154.76)

### 我们当前标记数据的坐标来源

我们当前 4,807 个标记的坐标已经是 0-100 百分比坐标，且数据中包含 `link` 字段指向 `interactivemap.app`，说明坐标可能来自 InteractiveMap.app 的数据。

### 坐标映射需求

如果要从 ZeroLuck 获取新标记或更新底图，需要建立:
```
ZeroLuck 游戏坐标 (gameX, gameY)
  → ZeroLuck 地图像素 (mapX, mapY)  [通过 affine-2d]
  → 我们的百分比坐标 (x, y)          [需要映射]
```

可以选取几个已知标记点（两个数据源都有）来建立映射关系。

---

## 四、优先级建议

### 立即可做（纯数据工作）

1. **下载 ZeroLuck 的标记 JSON** — 已有公开 API
   ```bash
   curl -s "https://zeroluck.gg/nte/data/interactive-map/starter-markers.en.json"
   ```

2. **下载 ZeroLuck 的瓦片元数据** — 从 `__NEXT_DATA__` 提取完整的 tile grid 定义

3. **建立坐标映射** — 选取已知的传送点/BOSS 等标记，建立两个坐标系的转换关系

4. **补充未闻浦标记** — 当前仅 192 个，ZeroLuck 有更多数据可补充

### 中期（底图升级）

5. **从 ZeroLuck CDN 下载 430 张瓦片** — 拼接为完整底图

6. **重新切片为我们的 Leaflet 格式** — 使用 `generate-map-tiles.js`

7. **或切换到 ZeroLuck 的 tile grid 格式** — 改用 41×44 网格

### 长期（差异化）

8. **标记截图填充** — 从 ZeroLuck 的游戏资源中获取
9. **攻略链接填充** — 关联到 Wiki 攻略页面
10. **云端进度同步** — Cloudflare KV + Discord OAuth

---

## 五、数据获取脚本（参考）

### 5.1 ghzs666（底图最佳来源）

```bash
# 1. 获取所有标记数据（按分组，含所有区域）
curl -s "https://api-wiki-game.ghzs.com/v1d0/web/wanmei-yh/map" \
  -o ghzs666-markers.json

# 2. 获取区域数据（8 个区域）
curl -s "https://api-wiki-game.ghzs.com/v1d0/web/wanmei-yh/map/areas" \
  -o ghzs666-areas.json

# 3. 瓦片 URL 模板（可直接用于 Leaflet tileLayer）
# https://and-static.ghzs.com/web/yihuan-map-260528/{z}/{x}/{y}.webp
# 参数: tms: true, tileSize: 256, minZoom: 0, maxZoom: 6
```

### 5.2 InteractiveMap.app（标记数据最全）

```bash
# 1. 获取完整标记数据（4000+ 标记，一次获取）
curl -s "https://interactivemap.app/neverness-to-everness/maps/imapp/api/1/options.json" \
  -o imapp-markers.json

# 2. 获取地图配置（含瓦片 URL 模板、缩放范围等）
curl -s "https://interactivemap.app/neverness-to-everness/maps/imapp/api/getmaps"

# 3. 获取区域数据
curl -s "https://interactivemap.app/neverness-to-everness/maps/imapp/api/map_areas/1"

# 4. 瓦片样例（标准 XYZ 格式，可直接用于 Leaflet）
# https://interactivemap.app/neverness-to-everness/maps/imapp/uploads/tiles/nte-10/{z}_{x}_{y}.jpg
```

### 5.2 ZeroLuck

```bash
# 1. 获取初始标记（448 个）
curl -s "https://zeroluck.gg/nte/data/interactive-map/starter-markers.en.json" \
  -o zeroluck-markers.json

# 2. 按分类获取完整标记（16 个分类）
for cat in fast-travel stealable-loot monsters featured-business oracle-stone \
           mystery-box currencies arc-locations anomaly-vision phone-booth \
           wertheimer-tower collectible quests activities city-service viewpoints; do
  curl -s "https://zeroluck.gg/nte/data/interactive-map/categories/${cat}.en.json" \
    -o "zeroluck-${cat}.json"
done

# 3. 获取瓦片元数据（含所有瓦片 URL 和 bounds）
curl -s "https://zeroluck.gg/nte/interactive-map/" | \
  python3 -c "
import sys, re, json
html = sys.stdin.read()
m = re.search(r'__NEXT_DATA__.*?>(.*?)</script>', html)
data = json.loads(m.group(1))
tiles = data['props']['pageProps']['initialPayload']['map']['tiles']['items']
for t in tiles:
    print(t['url'])
"
```

---

## 六、风险和注意事项

1. **版权风险**: ZeroLuck 的瓦片数据来自游戏客户端资源，使用前需考虑版权问题
2. **数据准确性**: ZeroLuck 的标记数据可能不完全准确，需要验证
3. **坐标系差异**: ZeroLuck 和我们使用不同的坐标系，转换可能引入误差
4. **更新频率**: ZeroLuck 的数据更新频率未知，可能滞后于游戏版本
5. **社区态度**: 直接抓取竞品数据可能有社区伦理问题，建议仅作为参考

**建议**: 以 ZeroLuck 数据作为参考和验证，但最终标记数据应该通过游戏内实际探索来确认和完善。

---

## 七、底图升级实际验证（2026-05-31）

### 7.1 已完成工作

1. **下载 ghzs666 完整瓦片**: 4096 张 z=7 WebP 瓦片 (64x64 网格，256px)，存于 `tmp/ghzs666-tiles/`
2. **拼接完整底图**: `tmp/ghzs666-full.png` (16384x16384，7.7MB)
3. **裁剪内容区域**: 原始内容区域为 12032x13824（非正方形），裁剪后填充为 13824x13824
4. **生成测试瓦片**: z=1..6 共 5460 张瓦片（21MB），`public/images/maps/hethereau-full-hd.png` 作为源图
5. **已回滚**: 因坐标系对齐失败，已恢复原 8192px 底图和 z=1..5 瓦片

### 7.2 ghzs666 瓦片结构实测

```
URL: https://and-static.ghzs.com/web/yihuan-map-260528/{z}/{x}/{y}.webp
z=1: 2x2 中仅 (0,0) 有内容      → 1 张有效瓦片
z=2: 4x4 中仅 (0..1, 0..1) 有内容 → 4 张有效瓦片
z=3: 8x8 中仅 (0..3, 0..3) 有内容 → 16 张有效瓦片
z=4: 16x16 中仅 (0..7, 0..7)     → 64 张有效瓦片
z=7: 128x128 中仅 (0..63, 0..63) → 4096 张有效瓦片
规律: 有效瓦片范围 = 0..(2^(z-1)-1)，即只有左上象限有内容
```

**说明**: ghzs666 的 bounds 为 `[[-256,-256],[256,256]]`，但瓦片只覆盖了半张图。其地图内容不在 bounds 的中心，而是偏移到一角。

### 7.3 坐标系对齐问题

**核心问题**: ghzs666 底图的地图内容区域与我们标记坐标系的映射不够精确。

**实测数据**:
- 坐标映射公式（基于 5 个区域质心拟合）: `ghzsX = -4.7887 * ourX + 241.53`
- 我们的标记点 (50,50) → ghzs666 坐标 (2.1, -7.3) → 瓦片网格 (64.5, 65.8)
- 但 ghzs666 有效瓦片仅 0..63，所以 (64.5, 65.8) 落在无效区域
- 结果: 新底图上标记点全部落在黑色区域

**根因**: 基于 5 个区域质心拟合的线性映射精度不够（最大误差约 5 个 ghzs666 单位），叠加瓦片网格只有一半有内容，导致中心区域的标记完全偏移。

### 7.4 解决方案

**方案 A — 精确校准（推荐）**:
1. 选取 10-20 个已知标记点（传送点、BOSS 等在两个数据源都能找到的）
2. 建立精确的仿射变换（6 参数），而非简单的线性缩放+偏移
3. 用变换后的坐标重新映射底图

**方案 B — 游戏客户端提取**:
1. 从游戏客户端直接提取 MiniMap 底图（参考 `extracted/` 目录中的资源）
2. 使用我们自己的坐标系，无需坐标转换

**方案 C — 保持现状**:
1. 保持 8192px 底图
2. 专注标记数据补充和新区域添加
3. 底图清晰度对用户体验影响较小（标记功能才是核心价值）

### 7.5 保留的资源

```
tmp/ghzs666-tiles/                    — 原始瓦片 4096 张 WebP
tmp/ghzs666-full.png                  — 拼接完整底图 16384x16384
public/images/maps/hethereau-full-hd.png — 裁剪后 PNG 源图 13824x13824
tmp/coordinate-mapping.json           — ghzs666 坐标映射（基于区域质心）
tmp/imapp-coordinate-mapping.json     — IMapp 坐标映射（基于全部标记质心）
scripts/download-ghzs666-tiles.py     — 瓦片下载脚本（可复用）
```
