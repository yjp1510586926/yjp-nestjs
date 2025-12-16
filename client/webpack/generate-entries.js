const fs = require('fs');
const path = require('path');

/**
 * 自动扫描 pages 目录，生成 webpack entry 配置
 * @param {string} pagesDir - pages 目录的绝对路径
 * @returns {Object} webpack entry 对象
 */
function generateEntries(pagesDir) {
  const entries = {};

  // 检查目录是否存在
  if (!fs.existsSync(pagesDir)) {
    console.warn(`⚠️  Pages directory not found: ${pagesDir}`);
    return entries;
  }

  // 读取 pages 目录下的所有子目录
  const pageDirs = fs
    .readdirSync(pagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // 为每个页面目录生成 entry
  pageDirs.forEach(pageDir => {
    const entryFile = path.join(pagesDir, pageDir, 'index.tsx');
    const entryFileJs = path.join(pagesDir, pageDir, 'index.ts');

    // 检查是否存在 index.tsx 或 index.ts
    if (fs.existsSync(entryFile)) {
      entries[pageDir] = `./${path.relative(process.cwd(), entryFile)}`;
      console.log(`✅ Found entry: ${pageDir} -> ${entryFile}`);
    } else if (fs.existsSync(entryFileJs)) {
      entries[pageDir] = `./${path.relative(process.cwd(), entryFileJs)}`;
      console.log(`✅ Found entry: ${pageDir} -> ${entryFileJs}`);
    } else {
      console.warn(`⚠️  No entry file found for page: ${pageDir}`);
    }
  });

  if (Object.keys(entries).length === 0) {
    console.warn('⚠️  No entries found! Please check your pages directory structure.');
  } else {
    console.log(`\n📦 Generated ${Object.keys(entries).length} entries:`);
    console.log(JSON.stringify(entries, null, 2));
  }

  return entries;
}

module.exports = { generateEntries };
