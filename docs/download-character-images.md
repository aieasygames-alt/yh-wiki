# 角色立绘下载方法

## 数据源

NTE Fandom Wiki: https://neverness-to-everness.fandom.com
协议: CC-BY-SA

Fandom 页面直接抓取会被 403 拦截（bot protection），但 CDN 图片可直接下载。

## 下载流程

### 1. 通过 MediaWiki API 获取角色图片 URL

```
GET https://neverness-to-everness.fandom.com/api.php?action=query&titles=Adler|Alphard|...&prop=pageimages&pithumbsize=512&format=json
```

- `titles`: 逗号分隔的页面标题（即角色英文名）
- `prop=pageimages`: 返回页面主图信息
- `pithumbsize=512`: 缩略图宽度
- 注意 Daffodil 在 Wiki 上拼写为 `Daffodill`（双 L），Zero 的图片在 `Esper Zero` 页面

返回的 `thumbnail.source` 格式:
```
https://static.wikia.nocookie.net/neverness-to-everness/images/{hash1}/{hash2}/{filename}/revision/latest/scale-to-width-down/{size}?cb={timestamp}
```

### 2. 获取原始分辨率

去掉 URL 中的 `/scale-to-width-down/{size}` 即可:
```
/revision/latest/scale-to-width-down/512 → /revision/latest
```

### 3. 下载图片

CDN 直接可访问，无需特殊 headers。返回格式为 WebP（即使 URL 后缀是 .jpg/.png）。

```bash
curl -s -o output.webp "https://static.wikia.nocookie.net/neverness-to-everness/images/.../revision/latest?cb=..."
```

### 4. 存放路径

```
public/images/characters/{id}.webp
```

id 对应 `data/characters.json` 中的 `id` 字段。

## 现有脚本

```bash
# 更新图片 URL 后运行
npx tsx scripts/download-images.ts
# 预览模式（不实际下载）
npx tsx scripts/download-images.ts --dry-run
```

脚本中 `CHARACTER_IMAGES` 记录了角色 ID 到 CDN URL 的映射。新增角色时需手动添加 URL。

## 获取新角色 URL 的步骤

1. 查询 Wiki 页面列表确认页面存在:
   ```
   GET https://neverness-to-everness.fandom.com/api.php?action=query&list=allpages&aplimit=50&format=json
   ```

2. 获取页面主图:
   ```
   GET https://neverness-to-everness.fandom.com/api.php?action=query&titles={CharacterName}&prop=pageimages&pithumbsize=512&format=json
   ```

3. 如果角色页面无主图，尝试 Gallery 子页面或用 web_reader 工具查看页面源码中的 `og:image`。

4. 将 CDN URL 添加到 `scripts/download-images.ts` 的 `CHARACTER_IMAGES` 映射中，运行下载。

## 当前状态

- 已下载 18/21 角色立绘
- 缺失: Nelly、Merula、Lilina（Fandom Wiki 无对应页面）
- 图片来源: Fandom Wiki CDN，CC-BY-SA 协议
