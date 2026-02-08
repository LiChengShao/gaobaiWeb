// 引入 Node.js 内置模块：用于读取/写入文件、遍历文件夹
const fs = require('fs');
const path = require('path');

// ************************ 配置项（根据你的项目路径调整，默认无需修改） ************************
const RAW_RECIPES_DIR = path.join(__dirname, 'src', 'data', 'raw-recipes'); // 原配方文件夹路径
const ITEM_MAPPING_FILE = path.join(__dirname, 'src', 'data', 'item-mapping.json'); // 物品映射表路径
const OUTPUT_RECIPES_FILE = path.join(__dirname, 'src', 'data', 'mc-recipes.json'); // 输出最终配方文件路径
// *****************************************************************************************

// 步骤 1：读取物品映射表
let itemMapping = {};
try {
  const mappingContent = fs.readFileSync(ITEM_MAPPING_FILE, 'utf-8');
  itemMapping = JSON.parse(mappingContent);
  console.log('✅ 成功读取物品映射表');
} catch (err) {
  console.error('❌ 读取物品映射表失败：', err.message);
  process.exit(1); // 读取失败则退出脚本
}

// 步骤 2：定义核心转换函数：单个原配方 → 项目所需格式
function convertSingleRecipe(rawRecipeContent) {
  try {
    const rawRecipe = JSON.parse(rawRecipeContent);

    // 过滤：只处理「有序合成」（crafting_shaped），跳过无序合成和其他类型
    if (rawRecipe.type !== 'minecraft:crafting_shaped') {
      return null; // 返回 null 表示跳过该配方
    }

    // 提取目标物品信息（从 result 中获取）
    const targetRawId = rawRecipe.result?.item;
    if (!targetRawId) {
      console.warn('⚠️  跳过无结果的配方：', JSON.stringify(rawRecipe));
      return null;
    }
    const targetMapping = itemMapping[targetRawId];
    if (!targetMapping) {
      console.warn(`⚠️  跳过无物品映射的配方（目标物品：${targetRawId}）`);
      return null;
    }

    // 提取配方的 key（占位符 → 原物品 ID）和 pattern（合成图案）
    const recipeKey = rawRecipe.key || {};
    const recipePattern = rawRecipe.pattern || [];
    if (recipePattern.length === 0) {
      console.warn('⚠️  跳空图案的配方：', targetRawId);
      return null;
    }

    // 步骤 3：补全 pattern 为 3x3 格式（不足 3 行补空行，不足 3 列补空格）
    const full3x3Pattern = [...recipePattern];
    // 补全 3 行
    while (full3x3Pattern.length < 3) {
      full3x3Pattern.push('   ');
    }
    // 每行补全 3 个字符（不足补空格，超出截断）
    const normalizedPattern = full3x3Pattern.map(line => line.padEnd(3, ' ').slice(0, 3));

    // 步骤 4：将 3x3 图案转换为 9 格一维数组（映射为项目物品 ID，空格对应 null）
    const finalPattern = [];
    for (const line of normalizedPattern) {
      for (const char of line) {
        if (char === ' ') {
          // 空格 → null（空格子）
          finalPattern.push(null);
        } else {
          // 占位符 → 原物品 ID → 项目物品 ID
          const ingredientRawId = recipeKey[char]?.item;
          const ingredientMapping = ingredientRawId ? itemMapping[ingredientRawId] : null;
          finalPattern.push(ingredientMapping ? ingredientMapping.id : null);
        }
      }
    }

    // 步骤 5：返回转换后的单个配方（符合项目 mc-recipes.json 格式）
    return {
      targetName: targetMapping.name,
      targetIcon: targetMapping.icon,
      pattern: finalPattern
    };
  } catch (err) {
    console.warn('⚠️  转换单个配方失败：', err.message);
    return null;
  }
}

// 步骤 6：遍历 raw-recipes 文件夹，批量处理所有原配方 JSON
function batchConvertRecipes() {
  const finalRecipesList = [];

  // 读取 raw-recipes 文件夹下所有文件
  const files = fs.readdirSync(RAW_RECIPES_DIR);
  for (const file of files) {
    // 只处理 .json 文件
    if (!file.endsWith('.json')) {
      continue;
    }

    // 读取单个原配方文件内容
    const filePath = path.join(RAW_RECIPES_DIR, file);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const convertedRecipe = convertSingleRecipe(fileContent);
      // 转换成功且不为 null 的配方，加入最终列表
      if (convertedRecipe) {
        finalRecipesList.push(convertedRecipe);
      }
    } catch (err) {
      console.warn(`⚠️  读取配方文件 ${file} 失败：`, err.message);
    }
  }

  // 步骤 7：将最终配方列表写入 mc-recipes.json 文件
  try {
    fs.writeFileSync(OUTPUT_RECIPES_FILE, JSON.stringify(finalRecipesList, null, 2), 'utf-8');
    console.log(`✅ 批量转换完成！共生成 ${finalRecipesList.length} 个有序合成配方`);
    console.log(`✅ 最终文件已保存到：${OUTPUT_RECIPES_FILE}`);
  } catch (err) {
    console.error('❌ 写入最终配方文件失败：', err.message);
    process.exit(1);
  }
}

// 执行批量转换
batchConvertRecipes();