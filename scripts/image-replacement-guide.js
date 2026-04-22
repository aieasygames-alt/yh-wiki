#!/usr/bin/env node
/**
 * Image Replacement Guide and Helper
 *
 * 由于 ntegame.com 受 Cloudflare 保护，无法自动抓取图片。
 *
 * 请选择以下方式之一替换图片：
 *
 * 方式一：手动替换
 * 1. 将 PNG/JPG 图片放入 public/images/{type}/ 目录
 * 2. 运行：node scripts/convert-to-webp.js
 *
 * 方式二：使用 URL 导入
 * 1. 编辑 data/image-sources.json 添加图片 URL
 * 2. 运行：node scripts/import-images.js
 *
 * ==================== 图片规格要求 ====================
 *
 * 角色图片:
 *   - 尺寸: 400x500px (2:2.5)
 *   - 格式: PNG/JPG → 自动转 WebP
 *   - 大小: < 100KB
 *   - 命名: {id}.png (如 nanally.png)
 *
 * 武器图片:
 *   - 尺寸: 600x200px (3:1) 或 400x400px (1:1)
 *   - 格式: PNG/JPG → 自动转 WebP
 *   - 大小: < 80KB
 *   - 命名: {id}.png (如 fangs-and-claws.png)
 *
 * 载具图片:
 *   - 尺寸: 600x400px (3:2)
 *   - 格式: PNG/JPG → 自动转 WebP
 *   - 大小: < 100KB
 *   - 命名: {id}.png (如 drift-photon.png)
 *
 * =====================================================
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");

// 生成图片 ID 映射表
function generateImageMap() {
  const characters = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "characters.json"), "utf-8"));
  const weapons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "weapons.json"), "utf-8"));
  const vehicles = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "vehicles.json"), "utf-8"));

  const map = {
    characters: {},
    weapons: {},
    vehicles: {},
  };

  characters.forEach((c) => {
    map.characters[c.id] = {
      name: c.name,
      nameEn: c.nameEn,
      currentImage: c.image,
      needsReplacement: c.image.includes("placeholder") || !c.image
    };
  });

  weapons.forEach((w) => {
    map.weapons[w.id] = {
      name: w.name,
      nameEn: w.nameEn,
      currentImage: w.image,
      needsReplacement: w.image.includes("placeholder") || !w.image
    };
  });

  vehicles.forEach((v) => {
    map.vehicles[v.id] = {
      name: v.name,
      nameEn: v.nameEn,
      currentImage: v.image,
      needsReplacement: v.image.includes("placeholder") || !v.image
    };
  });

  return map;
}

function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🖼️  图片替换助手");
  console.log("=".repeat(60) + "\n");

  const map = generateImageMap();

  // 统计
  const charStats = Object.values(map.characters).filter((c) => c.needsReplacement).length;
  const weaponStats = Object.values(map.weapons).filter((w) => w.needsReplacement).length;
  const vehicleStats = Object.values(map.vehicles).filter((v) => v.needsReplacement).length;

  console.log("📊 当前状态:");
  console.log(`   角色: ${charStats}/38 需要替换`);
  console.log(`   武器: ${weaponStats}/42 需要替换`);
  console.log(`   载具: ${vehicleStats}/16 需要替换`);
  console.log("");

  console.log("📋 图片文件清单:");
  console.log("");

  console.log("【角色】38 个:");
  Object.entries(map.characters).forEach(([id, info], i) => {
    console.log(`   ${String(i + 1).padStart(2)}. ${id.padEnd(20)} - ${info.name} (${info.nameEn})`);
  });

  console.log("\n【武器】42 个:");
  Object.entries(map.weapons).forEach(([id, info], i) => {
    console.log(`   ${String(i + 1).padStart(2)}. ${id.padEnd(30)} - ${info.name} (${info.nameEn})`);
  });

  console.log("\n【载具】16 个:");
  Object.entries(map.vehicles).forEach(([id, info], i) => {
    console.log(`   ${String(i + 1).padStart(2)}. ${id.padEnd(20)} - ${info.name} (${info.nameEn})`);
  });

  console.log("\n" + "=".repeat(60));
  console.log("📁 目录结构:");
  console.log("=".repeat(60));
  console.log(`   ${ROOT}/public/images/`);
  console.log(`   ├── characters/   (38 个文件)`);
  console.log(`   ├── weapons/      (42 个文件)`);
  console.log(`   └── vehicles/     (16 个文件)`);
  console.log("");

  console.log("🔄 替换步骤:");
  console.log("=".repeat(60));
  console.log("   1. 将图片放入对应目录 (PNG/JPG 格式)");
  console.log("   2. 运行转换脚本: node scripts/convert-to-webp.js");
  console.log("");

  console.log("💡 提示:");
  console.log("   - 图片会自动转换为 WebP 格式");
  console.log("   - 原始 PNG/JPG 文件会被删除");
  console.log("   - 确保图片文件名与 ID 一致 (如 nanally.png)");
  console.log("");
}

main();
