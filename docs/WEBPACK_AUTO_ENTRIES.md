# Webpack Entry 自动生成

## 📋 功能说明

不再需要手动在 `webpack.common.js` 中硬编码页面入口！

现在 webpack 会自动扫描 `client/src/pages` 目录，为每个页面自动生成 entry 配置。

## 🚀 使用方法

### 1. 创建新页面

只需在 `client/src/pages` 下创建新目录和入口文件：

```bash
# 创建新页面目录
mkdir client/src/pages/my-page

# 创建入口文件
touch client/src/pages/my-page/index.tsx
```

### 2. 编写页面组件

```tsx
// client/src/pages/my-page/MyPage.tsx
import React from 'react';

export const MyPage: React.FC = () => {
  return <div>我的新页面</div>;
};
```

```tsx
// client/src/pages/my-page/index.tsx
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { MyPage } from './MyPage';

const container = document.getElementById('root');

if (container) {
  hydrateRoot(container, <MyPage />);
}
```

### 3. 构建

```bash
npm run build:client
```

**就这么简单！** 无需修改任何配置文件。

## 📦 工作原理

### 自动扫描脚本

`client/webpack/generate-entries.js` 会：

1. 扫描 `client/src/pages` 目录
2. 查找每个子目录下的 `index.tsx` 或 `index.ts`
3. 自动生成 webpack entry 配置

### 输出示例

```bash
✅ Found entry: about -> /path/to/client/src/pages/about/index.tsx
✅ Found entry: home -> /path/to/client/src/pages/home/index.tsx
✅ Found entry: users -> /path/to/client/src/pages/users/index.tsx

📦 Generated 3 entries:
{
  "about": "./client/src/pages/about/index.tsx",
  "home": "./client/src/pages/home/index.tsx",
  "users": "./client/src/pages/users/index.tsx"
}
```

## 📁 目录结构要求

```
client/src/pages/
├── home/
│   ├── index.tsx          ✅ 必需（入口文件）
│   ├── HomePage.tsx       ✅ 推荐（页面组件）
│   └── styles.css         ✅ 可选（样式文件）
├── users/
│   ├── index.tsx          ✅ 必需
│   ├── UsersPage.tsx      ✅ 推荐
│   └── styles.css         ✅ 可选
└── about/
    ├── index.tsx          ✅ 必需
    └── AboutPage.tsx      ✅ 推荐
```

**规则**：

- 每个页面必须有自己的目录
- 目录名即为 entry 名称（如 `home` → `home.js`）
- 必须包含 `index.tsx` 或 `index.ts` 作为入口

## ✅ 优势

### 之前（硬编码）

```javascript
// ❌ 每次添加页面都要手动修改
module.exports = {
  entry: {
    home: './client/src/pages/home/index.tsx',
    users: './client/src/pages/users/index.tsx',
    about: './client/src/pages/about/index.tsx', // 手动添加
    // ... 更多页面
  },
};
```

### 现在（自动发现）

```javascript
// ✅ 自动扫描，无需手动配置
const { generateEntries } = require('./generate-entries');
const pagesDir = path.resolve(__dirname, '../src/pages');

module.exports = {
  entry: generateEntries(pagesDir), // 自动生成
};
```

**好处**：

- ⚡ **更快** - 无需手动编辑配置
- 🔒 **更安全** - 减少人为错误
- 🎯 **更清晰** - 约定优于配置
- 📦 **更易维护** - 添加/删除页面自动同步

## 🔧 高级用法

### 自定义扫描目录

```javascript
// webpack.common.js
const customPagesDir = path.resolve(__dirname, '../src/custom-pages');
const entries = generateEntries(customPagesDir);
```

### 调试输出

构建时会自动输出发现的页面：

```bash
npm run build:client

# 输出：
# ✅ Found entry: home -> ...
# ✅ Found entry: users -> ...
# 📦 Generated 2 entries: {...}
```

## ⚠️ 注意事项

1. **入口文件命名**
   - 必须是 `index.tsx` 或 `index.ts`
   - 不支持其他文件名

2. **目录结构**
   - 只扫描一级子目录
   - 不会递归扫描嵌套目录

3. **构建缓存**
   - 如果添加新页面后构建没有包含，尝试清理缓存：
   ```bash
   npm run clean
   npm run build:client
   ```

## 📊 实际案例

### 测试：添加新页面

```bash
# 1. 创建新页面
mkdir client/src/pages/about
echo 'export const AboutPage = () => <div>About</div>' > client/src/pages/about/AboutPage.tsx
echo 'import { hydrateRoot } from "react-dom/client"; import { AboutPage } from "./AboutPage"; hydrateRoot(document.getElementById("root"), <AboutPage />);' > client/src/pages/about/index.tsx

# 2. 构建
npm run build:client

# 3. 查看输出
# ✅ Found entry: about -> .../about/index.tsx
# 📦 Generated 3 entries (包含 about)
```

### 结果

```
dist/client/
├── about.js      ✅ 自动生成
├── about.css     ✅ 自动生成（如果有样式）
├── home.js
├── home.css
├── users.js
└── users.css
```

## 🎉 总结

通过自动扫描机制，我们实现了：

- ✅ **零配置** - 创建页面即可，无需修改 webpack 配置
- ✅ **自动发现** - 新页面自动加入构建
- ✅ **约定优于配置** - 遵循目录结构即可
- ✅ **开发效率提升** - 专注于业务代码，而非配置

---

**创建时间**: 2025-12-16  
**作者**: Architecture Team  
**版本**: 1.0.0
