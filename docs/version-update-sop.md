# NTE 版本更新 SOP — 标准操作流程

> 最后更新：2026-05-14
> 适用范围：nteguide.com 网站 v1.1 及后续版本更新

---

## 一、版本更新时间线

```
T-14天  前瞻直播 → 2小时内发博客汇总
T-7天   数据挖掘/爆料 → 更新 upcoming 角色
T-3天   新内容攻略草稿准备
T-0天   版本上线 → 版本更新博客 + 角色攻略 + 兑换码
T+1天   新角色详细攻略（build/配队/材料）
T+7天   深度攻略 + 强度榜更新
```

## 二、前瞻直播操作清单（T-14天）

### 2.1 直播前准备

- [ ] 确认直播时间和平台（B站/YouTube/Twitter）
- [ ] 准备博客模板：`nte-v{version}-preview`
- [ ] 准备兑换码收集模板

### 2.2 直播中操作

- [ ] 记录新角色名称、属性、定位
- [ ] 记录新活动内容和奖励
- [ ] 记录兑换码（通常 3-6 个）
- [ ] 记录系统改动/优化
- [ ] 记录联动信息

### 2.3 直播后 2 小时内

- [ ] 发布前瞻博客（中文+英文双语）
- [ ] 更新兑换码数据（data/redeem-codes.json）
- [ ] 添加 upcoming 角色到 characters.json（status: "upcoming"）
- [ ] 更新 v1.1 前瞻 FAQ 到 faqs.json
- [ ] 社交媒体发布（Discord/Reddit/Twitter）

## 三、数据更新操作（T-7天 至 T-0天）

### 3.1 新角色数据录入

**文件：** `data/characters.json`

```json
{
  "id": "xun",
  "name": "浔",
  "nameTw": "潯",
  "nameEn": "Xun",
  "rank": "S",
  "attribute": "liquid",
  "role": "dps",
  "status": "upcoming",  // 上线后改为 "available"
  "tierRank": "",         // 上线后评测填入
  "image": "/images/characters/xun.webp",
  // ... 其他字段按模板填充
}
```

### 3.2 新弧盘数据录入

**文件：** `data/weapons.json`

```json
{
  "id": "new-weapon-slug",
  "name": "弧盘中文名",
  "nameEn": "Arc Disc English Name",
  "rank": "S",
  "type": "gas|liquid|plasma|solid|synthesis",
  "status": "available",
  // ... 按弧盘PRD模板填充
}
```

### 3.3 兑换码更新

**文件：** `data/redeem-codes.json`

```json
{
  "code": "NEWCODE123",
  "reward": "奖励中文描述",
  "rewardEn": "Reward English description",
  "status": "active",
  "expiresAt": "2026-06-30",
  "source": "livestream",
  "region": "global",
  "revealedAt": "2026-05-28"
}
```

**注意事项：**
- 过期兑换码 status 改为 `"expired"`
- 区分 cn/global 区域
- 奖励描述同时填写中英文

## 四、版本上线操作清单（T-0天）

### 4.1 内容发布（优先级排序）

| 优先级 | 内容 | 文件/页面 | 截止时间 |
|--------|------|----------|---------|
| P0 | 版本更新博客 | data/blog.json | 上线后 2h |
| P0 | 新兑换码 | data/redeem-codes.json | 上线后 1h |
| P0 | upcoming→available 角色切换 | data/characters.json | 上线后 1h |
| P1 | 新角色基础攻略 | data/blog.json | 上线后 4h |
| P1 | 新弧盘数据 | data/weapons.json | 上线后 4h |
| P2 | 新活动攻略 | data/blog.json | 上线后 24h |

### 4.2 技术操作

```bash
# 1. 更新数据文件
# 2. 运行 prebuild
cd yh-wiki && node scripts/prebuild.js

# 3. 本地验证
npm run build

# 4. 检查关键页面
# - 新角色页面渲染正确
# - 新兑换码显示在列表
# - Blog页面内容完整

# 5. 部署
git add data/ app/ && git commit -m "v1.1 update: new characters, weapons, codes"
git push
```

## 五、角色攻略模板（T+1天）

### 5.1 Blog 文章结构

```
标题：异环{角色名}最佳Build攻略：弧盘、武器、配队与养成路线全解

1. 角色概览
   - 基础属性 / 定位 / 获取方式
2. 技能详解
   - 普攻 / 战技 / 变轨 / 终结技 / 被动
3. 最佳弧盘推荐
   - 毕业套装 / 平替套装 / 主词条 / 副词条优先级
4. 最佳武器推荐
   - 专武 / 4星替代 / 3星替代
5. 配队推荐
   - T0配队 / 平民配队 / 自动战斗配队
6. 养成优先级
   - 等级 / 技能 / 弧盘 / 武器升级顺序
7. FAQ
```

### 5.2 角色数据完整性检查

每个 available 角色需要确认：
- [ ] 基础属性完整（HP/ATK/DEF 等）
- [ ] 技能数据完整（倍率/效果）
- [ ] tierRank 已评定
- [ ] tierReason 中英双语已填写
- [ ] 最佳弧盘推荐已关联
- [ ] 配队推荐已更新
- [ ] 角色图片已上传

## 六、强度榜更新流程（T+7天）

### 6.1 数据采集

- [ ] 收集社区反馈（Reddit/Discord/B站）
- [ ] 参考竞品 Wiki 的 tier list（game8/neverness.gg/prydwen）
- [ ] 汇总深渊/高难副本使用率数据
- [ ] 考虑新角色对现有角色的影响

### 6.2 更新操作

1. 更新 `data/characters.json` 中每个角色的 `tierRank` 和 `tierReason`
2. 发布新版 Tier List 博客（data/blog.json）
3. 更新 tier-list 页面自动反映新排名

## 七、竞品监控清单

| 竞品 | 监控频率 | 关注内容 |
|------|---------|---------|
| game8.co/NTE | 每周 | 新攻略覆盖、角色评级 |
| neverness.gg | 每周 | 数据库更新、工具功能 |
| prydwen.gg | 每周 | 角色build、tier list |
| ntebuild.com | 每两周 | 角色配装推荐 |
| Reddit r/NevernessToEverness | 每日 | 社区热点、攻略需求 |

---

*SOP 版本 1.0 — 2026-05-14*
