#!/usr/bin/env node
/**
 * 从百度、Google、Bing 收集"异环"相关联想词
 * 用法: node scripts/collect-keywords.js
 * 输出: data/__raw__/keyword-raw-{timestamp}.json
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const RAW_DIR = path.join(DATA_DIR, "__raw__");

// 确保 __raw__ 目录存在
if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

// ── 种子词 ──
const seeds = [
  // 核心词
  "异环",
  "NTE",
  "Neverness to Everness",
  // 问题前缀
  "异环怎么",
  "异环如何",
  "异环哪里",
  "异环什么",
  "异环多少",
  "异环能不能",
  "异环好不好",
  "异环值得",
  // 系统词
  "异环抽卡",
  "异环下载",
  "异环配置",
  "异环公测",
  "异环觉醒",
  "异环异能",
  "异环异象",
  "异环地图",
  "异环战斗",
  "异环武器",
  "异环磁盘",
  "异环体力",
  "异环属性",
  "异环保底",
  "异环卡池",
  "异环角色",
  "异环攻略",
  "异环新手",
  "异环开荒",
  "异环阵容",
  "异环配队",
  "异环材料",
  "异环升级",
  "异环信用点",
  "异环兑换码",
];

// 字母扩展（用于获取更多联想词）
const alphabetSuffixes = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

const DELAY_MS = 400; // 请求间隔

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── 百度联想词 ──
async function fetchBaiduSuggestions(query) {
  try {
    const url = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=j`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    const text = await res.text();
    // 解析 JSONP: j({q:"...",p:false,s:["...","..."]})
    const match = text.match(/\((\{.*\})\)/);
    if (!match) return [];
    const data = JSON.parse(match[1]);
    return data.s || [];
  } catch {
    return [];
  }
}

// ── Google 联想词 ──
async function fetchGoogleSuggestions(query) {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&hl=zh-CN`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data[1] || [];
  } catch {
    return [];
  }
}

// ── Bing 联想词 ──
async function fetchBingSuggestions(query) {
  try {
    const url = `https://api.bing.com/qsonhs.aspx?type=cb&q=${encodeURIComponent(query)}&cb=j`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    const text = await res.text();
    const match = text.match(/\((\{.*\})\)/);
    if (!match) return [];
    const data = JSON.parse(match[1]);
    return (data.AS?.Results?.[0]?.Suggests || []).map((s) => s.Txt);
  } catch {
    return [];
  }
}

// ── 字母扩展收集（仅百度）──
async function collectAlphabetExpanded(seed) {
  const results = [];
  for (const suffix of alphabetSuffixes.slice(0, 10)) { // 限制为前10个，避免过多请求
    const suggestions = await fetchBaiduSuggestions(seed + " " + suffix);
    results.push(...suggestions);
    await delay(DELAY_MS);
  }
  return results;
}

// ── 主流程 ──
async function main() {
  const allKeywords = {}; // { keyword: { sources: ["baidu","google"], queries: [...] } }
  let totalCollected = 0;

  console.log("开始收集联想词...");
  console.log(`种子词数量: ${seeds.length}`);

  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    console.log(`[${i + 1}/${seeds.length}] 正在收集: "${seed}"`);

    // 百度
    const baiduResults = await fetchBaiduSuggestions(seed);
    for (const kw of baiduResults) {
      if (!allKeywords[kw]) allKeywords[kw] = { sources: [], queries: [] };
      if (!allKeywords[kw].sources.includes("baidu")) allKeywords[kw].sources.push("baidu");
      if (!allKeywords[kw].queries.includes(seed)) allKeywords[kw].queries.push(seed);
    }
    totalCollected += baiduResults.length;
    await delay(DELAY_MS);

    // Google
    const googleResults = await fetchGoogleSuggestions(seed);
    for (const kw of googleResults) {
      if (!allKeywords[kw]) allKeywords[kw] = { sources: [], queries: [] };
      if (!allKeywords[kw].sources.includes("google")) allKeywords[kw].sources.push("google");
      if (!allKeywords[kw].queries.includes(seed)) allKeywords[kw].queries.push(seed);
    }
    totalCollected += googleResults.length;
    await delay(DELAY_MS);

    // Bing
    const bingResults = await fetchBingSuggestions(seed);
    for (const kw of bingResults) {
      if (!allKeywords[kw]) allKeywords[kw] = { sources: [], queries: [] };
      if (!allKeywords[kw].sources.includes("bing")) allKeywords[kw].sources.push("bing");
      if (!allKeywords[kw].queries.includes(seed)) allKeywords[kw].queries.push(seed);
    }
    totalCollected += bingResults.length;
    await delay(DELAY_MS);

    // 部分种子做字母扩展
    if (i < 5) { // 只对前5个核心种子做字母扩展
      const expanded = await collectAlphabetExpanded(seed);
      for (const kw of expanded) {
        if (!allKeywords[kw]) allKeywords[kw] = { sources: [], queries: [] };
        if (!allKeywords[kw].sources.includes("baidu-alpha")) allKeywords[kw].sources.push("baidu-alpha");
        if (!allKeywords[kw].queries.includes(seed + "-alpha")) allKeywords[kw].queries.push(seed + "-alpha");
      }
      totalCollected += expanded.length;
    }
  }

  // 转为数组并排序（多源关键词排前面）
  const keywordsArray = Object.entries(allKeywords)
    .map(([keyword, info]) => ({
      keyword,
      sources: info.sources,
      sourceCount: info.sources.length,
      matchedSeeds: info.queries,
    }))
    .sort((a, b) => b.sourceCount - a.sourceCount || b.matchedSeeds.length - a.matchedSeeds.length);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outputPath = path.join(RAW_DIR, `keyword-raw-${timestamp}.json`);

  const output = {
    collectedAt: new Date().toISOString(),
    totalKeywords: keywordsArray.length,
    totalRaw: totalCollected,
    sources: { baidu: 0, google: 0, bing: 0, "baidu-alpha": 0 },
    keywords: keywordsArray,
  };

  // 统计各来源数量
  for (const kw of keywordsArray) {
    for (const s of kw.sources) {
      output.sources[s] = (output.sources[s] || 0) + 1;
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n收集完成！`);
  console.log(`去重后关键词: ${keywordsArray.length} 条`);
  console.log(`原始结果: ${totalCollected} 条`);
  console.log(`输出文件: ${outputPath}`);

  // 打印多源关键词（最值得关注）
  const multiSource = keywordsArray.filter((k) => k.sourceCount >= 2);
  console.log(`\n多源关键词 (${multiSource.length} 条):`);
  for (const kw of multiSource.slice(0, 30)) {
    console.log(`  [${kw.sources.join(",")}] ${kw.keyword}`);
  }
}

main().catch(console.error);
