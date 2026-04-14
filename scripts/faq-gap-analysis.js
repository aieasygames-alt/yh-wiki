#!/usr/bin/env node
/**
 * 关键词处理 + FAQ 缺口分析
 * 读取 data/__raw__/keyword-raw-*.json，与 data/faqs.json 对比
 * 输出: data/__processed__/faq-gap-report.json
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const RAW_DIR = path.join(DATA_DIR, "__raw__");
const PROC_DIR = path.join(DATA_DIR, "__processed__");

if (!fs.existsSync(PROC_DIR)) fs.mkdirSync(PROC_DIR, { recursive: true });

// ── 分类规则 ──
const categoryRules = [
  { category: "system", categoryZh: "游戏系统", categoryEn: "System", patterns: [/下载/, /安装/, /配置/, /要求/, /平台/, /手机/, /电脑/, /PC/, /安卓/, /iOS/, /模拟器/] },
  { category: "release", categoryZh: "上线信息", categoryEn: "Release", patterns: [/上线/, /公测/, /测试/, /开服/, /预约/, /预注册/, /什么时候/, /几点/] },
  { category: "gacha", categoryZh: "抽卡系统", categoryEn: "Gacha", patterns: [/抽卡/, /卡池/, /保底/, /概率/, /出货/, /祈愿/, /抽取/, /原晶/] },
  { category: "combat", categoryZh: "战斗机制", categoryEn: "Combat", patterns: [/闪避/, /环合/, /属性搭配/, /反应/, /连招/, /技能/, /战斗/, /输出/, /倍率/, /破防/] },
  { category: "exploration", categoryZh: "地图探索", categoryEn: "Exploration", patterns: [/地图/, /探索/, /海特洛/, /乌鸦/, /玉石/, /隐藏/, /宝箱/, /收集/, /传送/] },
  { category: "characters", categoryZh: "角色相关", categoryEn: "Characters", patterns: [/角色/, /娜娜莉/, /咲里/, /法蒂亚/, /爱德勒/, /拉克/, /百苍/, /斯奇亚/, /哈尼尔/, /哈索尔/, /弥安/, /阿尔法/, /泰格/, /智$/, /觉醒/] },
  { category: "leveling", categoryZh: "角色升级", categoryEn: "Leveling", patterns: [/升级/, /经验/, /等级/, /突破/, /猎手指南/] },
  { category: "materials", categoryZh: "材料获取", categoryEn: "Materials", patterns: [/材料/, /副本/, /领域/, /掉落/, /刷.*材料/, /许可/, /证明/] },
  { category: "equipment", categoryZh: "装备系统", categoryEn: "Equipment", patterns: [/武器/, /磁盘/, /圣遗物/, /装备/, /强化/, /词条/] },
  { category: "team-building", categoryZh: "配队推荐", categoryEn: "Team Building", patterns: [/配队/, /阵容/, /队伍/, /搭配/, /组合/] },
  { category: "currency", categoryZh: "货币系统", categoryEn: "Currency", patterns: [/信用点/, /货币/, /原晶/, /兑换码/, /礼包/] },
  { category: "beginner", categoryZh: "新手入门", categoryEn: "Beginner", patterns: [/新手/, /入门/, /开荒/, /推荐/, /攻略/, /怎么玩/] },
];

function classifyKeyword(keyword) {
  for (const rule of categoryRules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(keyword)) {
        return {
          category: rule.category,
          categoryZh: rule.categoryZh,
          categoryEn: rule.categoryEn,
        };
      }
    }
  }
  return { category: "other", categoryZh: "其他", categoryEn: "Other" };
}

// ── 主流程 ──
function main() {
  // 1. 找到最新的原始关键词文件
  const rawFiles = fs.readdirSync(RAW_DIR)
    .filter((f) => f.startsWith("keyword-raw-") && f.endsWith(".json"))
    .sort();

  if (rawFiles.length === 0) {
    console.log("未找到关键词数据。请先运行: node scripts/collect-keywords.js");
    // 使用预置数据作为后备
    console.log("将使用预置的高频搜索词进行缺口分析...");
    return runWithFallbackData();
  }

  const latestRaw = path.join(RAW_DIR, rawFiles[rawFiles.length - 1]);
  console.log(`读取关键词文件: ${latestRaw}`);
  const rawData = JSON.parse(fs.readFileSync(latestRaw, "utf-8"));

  processAndAnalyze(rawData.keywords);
}

function runWithFallbackData() {
  // 基于搜索结果分析的预置高频词
  const fallbackKeywords = [
    { keyword: "异环下载", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环下载"] },
    { keyword: "异环怎么下载安装", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环下载"] },
    { keyword: "异环手机配置要求", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环配置"] },
    { keyword: "异环PC版下载", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环下载"] },
    { keyword: "异环什么时候公测", sources: ["baidu", "google", "bing"], sourceCount: 3, matchedSeeds: ["异环公测"] },
    { keyword: "异环公测时间", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环公测"] },
    { keyword: "异环怎么参加测试", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环公测"] },
    { keyword: "异环预约奖励", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环公测"] },
    { keyword: "异环保底机制", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环保底"] },
    { keyword: "异环抽卡概率", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环抽卡"] },
    { keyword: "异环新手抽什么卡池", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环抽卡"] },
    { keyword: "异环抽卡用什么货币", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环抽卡"] },
    { keyword: "异环极限闪避怎么触发", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环战斗"] },
    { keyword: "异环环合爆发怎么用", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环战斗"] },
    { keyword: "异环属性搭配推荐", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环属性"] },
    { keyword: "异环战斗技巧", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环战斗"] },
    { keyword: "异环海特洛市探索", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环地图"] },
    { keyword: "异环乌鸦玉石在哪", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环地图"] },
    { keyword: "异环隐藏区域怎么进", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环地图"] },
    { keyword: "异环觉醒系统", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环觉醒"] },
    { keyword: "异环异象委托怎么做", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环异象"] },
    { keyword: "异环异能有哪些类型", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环异能"] },
    { keyword: "异环磁盘系统怎么玩", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环磁盘"] },
    { keyword: "异环武器怎么强化", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环武器"] },
    { keyword: "异环兑换码大全", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环兑换码"] },
    { keyword: "异环兑换码怎么用", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环兑换码"] },
    { keyword: "异环预抽卡怎么参与", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环抽卡"] },
    { keyword: "异环测试数据会保留吗", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环公测"] },
    { keyword: "异环开局抽什么角色", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环新手"] },
    { keyword: "异环体力恢复时间", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环体力"] },
    { keyword: "异环怎么赚信用点", sources: ["baidu"], sourceCount: 1, matchedSeeds: ["异环信用点"] },
    { keyword: "异环新手阵容推荐", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环配队"] },
    { keyword: "异环角色排行", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环角色"] },
    { keyword: "异环开局怎么玩", sources: ["baidu", "google"], sourceCount: 2, matchedSeeds: ["异环新手"] },
  ];

  processAndAnalyze(fallbackKeywords);
}

function processAndAnalyze(keywords) {
  // 2. 分类
  const categorized = {};
  for (const kw of keywords) {
    const cat = classifyKeyword(kw.keyword);
    if (!categorized[cat.category]) {
      categorized[cat.category] = {
        ...cat,
        keywords: [],
      };
    }
    categorized[cat.category].keywords.push(kw);
  }

  // 3. 读取现有 FAQ
  const faqsPath = path.join(DATA_DIR, "faqs.json");
  const existingFaqs = JSON.parse(fs.readFileSync(faqsPath, "utf-8"));
  const existingCategories = new Set(existingFaqs.map((f) => f.category));

  // 4. 缺口分析
  const covered = [];
  const gaps = [];

  for (const [catSlug, catData] of Object.entries(categorized)) {
    if (catSlug === "other") continue;

    for (const kw of catData.keywords) {
      // 检查是否有现有 FAQ 覆盖了这个关键词
      const matchedFaq = existingFaqs.find((faq) => {
        const faqText = `${faq.question} ${faq.answer}`.toLowerCase();
        const kwCore = kw.keyword.replace(/^异环/, "").toLowerCase();
        // 检查关键词的核心部分是否出现在 FAQ 问题或答案中
        return faqText.includes(kwCore) || kwCore.split("").filter((c) => /[\u4e00-\u9fff]/.test(c)).length <= 2;
      });

      if (matchedFaq) {
        covered.push({ keyword: kw.keyword, faqId: matchedFaq.id, faqQuestion: matchedFaq.question });
      } else {
        // 根据关键词生成建议问题
        const suggestedQ = kw.keyword.endsWith("？") || kw.keyword.endsWith("?")
          ? kw.keyword
          : kw.keyword + "？";

        gaps.push({
          category: catSlug,
          categoryZh: catData.categoryZh,
          categoryEn: catData.categoryEn,
          keyword: kw.keyword,
          suggestedQuestion: suggestedQ,
          sourceCount: kw.sourceCount,
          sources: kw.sources,
          priority: kw.sourceCount >= 3 ? "high" : kw.sourceCount >= 2 ? "medium" : "low",
          isNewCategory: !existingCategories.has(catSlug),
        });
      }
    }
  }

  // 5. 合并同分类的缺口，生成建议 FAQ 条目
  const suggestedFaqs = [];
  const gapsByCategory = {};
  for (const gap of gaps) {
    if (!gapsByCategory[gap.category]) gapsByCategory[gap.category] = [];
    gapsByCategory[gap.category].push(gap);
  }

  for (const [catSlug, catGaps] of Object.entries(gapsByCategory)) {
    // 取优先级最高的关键词作为主问题
    const sorted = catGaps.sort((a, b) => b.sourceCount - a.sourceCount);
    const main = sorted[0];
    const relatedKeywords = sorted.slice(1).map((g) => g.keyword);

    suggestedFaqs.push({
      category: catSlug,
      categoryZh: main.categoryZh,
      categoryEn: main.categoryEn,
      mainQuestion: main.suggestedQuestion,
      relatedKeywords,
      priority: sorted.some((g) => g.priority === "high") ? "high"
        : sorted.some((g) => g.priority === "medium") ? "medium" : "low",
      isNewCategory: main.isNewCategory,
    });
  }

  // 按优先级排序
  suggestedFaqs.sort((a, b) => {
    if (a.isNewCategory && !b.isNewCategory) return -1;
    if (!a.isNewCategory && b.isNewCategory) return 1;
    const p = { high: 3, medium: 2, low: 1 };
    return (p[b.priority] || 0) - (p[a.priority] || 0);
  });

  // 6. 输出报告
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalKeywords: keywords.length,
      coveredCount: covered.length,
      gapCount: gaps.length,
      suggestedFaqCount: suggestedFaqs.length,
      existingFaqCount: existingFaqs.length,
      existingCategories: [...existingCategories],
      newCategories: suggestedFaqs.filter((f) => f.isNewCategory).map((f) => f.category),
    },
    covered,
    gaps: gaps.sort((a, b) => b.sourceCount - a.sourceCount),
    suggestedFaqs,
  };

  const outputPath = path.join(PROC_DIR, "faq-gap-report.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");

  console.log("\n=== 缺口分析报告 ===");
  console.log(`总关键词: ${report.summary.totalKeywords}`);
  console.log(`已覆盖: ${report.summary.coveredCount}`);
  console.log(`缺口: ${report.summary.gapCount}`);
  console.log(`建议新增 FAQ: ${report.summary.suggestedFaqCount} 条`);
  console.log(`新分类: ${report.summary.newCategories.join(", ") || "无"}`);
  console.log(`\n输出文件: ${outputPath}`);

  console.log("\n=== 建议新增 FAQ ===");
  for (const faq of suggestedFaqs) {
    const mark = faq.isNewCategory ? "[NEW]" : "[补]";
    console.log(`  ${mark} [${faq.priority}] ${faq.mainQuestion} (${faq.categoryZh})`);
    if (faq.relatedKeywords.length > 0) {
      console.log(`    相关词: ${faq.relatedKeywords.slice(0, 3).join(", ")}`);
    }
  }
}

main();
