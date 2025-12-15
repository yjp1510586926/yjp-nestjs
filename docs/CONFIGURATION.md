# ⚙️ 项目配置指南

本文档包含项目的所有配置说明和常见问题解决方案。

---

## 📋 目录

1. [Views 自动复制配置](#views-自动复制配置)
2. [静态资源配置](#静态资源配置)
3. [依赖优化建议](#依赖优化建议)
4. [开发工作流](#开发工作流)

---

## 1. Views 自动复制配置

### nest-cli.json 配置

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": false,
    "tsConfigPath": "tsconfig.json",
    "assets": [
      {
        "include": "views/**/*",
        "outDir": "dist"
      }
    ],
    "watchAssets": true
  }
}
```

### 工作原理

- **构建时**：`pnpm run build` 会自动复制 `src/views/` 到 `dist/views/`
- **开发时**：`pnpm run start:dev` 会监听 views 文件变化并自动复制

### 目录结构

```
src/views/pages/home.ejs  →  dist/views/pages/home.ejs
```

---

## 2. 静态资源配置

### 问题：静态资源 404

**原因**：编译后 `__dirname` 指向 `dist/src`，而静态文件在 `dist/client`

### 解决方案

**src/main.ts**:
```typescript
// 配置静态资源
app.useStaticAssets(join(__dirname, '..', 'client'), {
  prefix: '/static/',
});
```

**路径解析**:
- `__dirname` = `dist/src`
- `join(__dirname, '..', 'client')` = `dist/client` ✅

### 验证

```bash
curl -I http://localhost:3000/static/home.css
# 应该返回 200 OK
```

---

## 3. 依赖优化建议

### 已移除的依赖

#### DevDependencies
- ❌ `ts-loader` - 已改用 swc-loader
- ❌ `style-loader` - 使用 mini-css-extract-plugin
- ❌ `webpack-manifest-plugin` - 未使用

### 可选移除（如果不需要）

#### 数据库相关
```bash
pnpm remove @nestjs/typeorm typeorm pg
```

#### 认证相关
```bash
pnpm remove @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcrypt
```

#### 测试相关（如果不写测试）
```bash
pnpm remove jest ts-jest @testing-library/react @testing-library/jest-dom @nestjs/testing supertest
```

### 核心依赖（必须保留）

**生产依赖**:
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config`, `@nestjs/swagger`
- `react`, `react-dom`
- `ejs`, `class-transformer`, `class-validator`

**开发依赖**:
- `@swc/core`, `swc-loader`
- `webpack`, `webpack-cli`
- `tailwindcss`, `postcss`, `autoprefixer`
- `typescript`, `@nestjs/cli`

---

## 4. 开发工作流

### 推荐方式（两个终端）

```bash
# 终端 1: 前端 watch
pnpm run watch:client

# 终端 2: 后端 watch
pnpm run start:dev
```

### 工作流程

1. **修改代码**
   - 前端：`client/src/pages/home/HomePage.tsx`
   - 后端：`src/app.controller.ts`

2. **自动编译**
   - Webpack 监听前端变化 → 重新编译
   - NestJS 监听后端变化 → 重新启动

3. **查看更新**
   - 等待 2-3 秒（编译完成）
   - 刷新浏览器（Cmd+R）
   - 看到更新 ✅

### 为什么需要手动刷新？

这是 SSR 应用的标准行为：
- ✅ 页面 HTML 在服务端生成
- ✅ 浏览器不知道服务端代码变化
- ✅ 需要重新请求页面才能看到新内容

这与 Next.js、Nuxt.js 等主流 SSR 框架一致。

---

## 5. 常见问题

### Q: 修改 React 组件后页面没更新？

**A**: 需要等待编译完成并刷新浏览器。

1. 确认 `watch:client` 正在运行
2. 确认 `start:dev` 正在运行
3. 等待 2-3 秒
4. 刷新浏览器

### Q: 静态资源 404？

**A**: 重新构建前端

```bash
rm -rf dist/client
pnpm run build:client:dev
```

### Q: Views 找不到？

**A**: 手动复制或重新构建

```bash
cp -r src/views dist/
# 或
pnpm run build
```

### Q: 如何添加新页面？

**A**: 

1. 创建 EJS 模板
```bash
touch src/views/pages/about.ejs
```

2. 创建 React 组件
```bash
mkdir -p client/src/pages/about
touch client/src/pages/about/index.tsx
```

3. 添加 Webpack 入口
```javascript
// client/webpack/webpack.common.js
entry: {
  home: './client/src/pages/home/index.tsx',
  about: './client/src/pages/about/index.tsx', // 新增
}
```

4. 添加 Controller 路由
```typescript
@Get('about')
@Render('pages/about')
getAbout() {
  return { title: '关于我们' };
}
```

---

## 6. 性能优化

### 已实现的优化

- ✅ **SWC 编译器** - 比 ts-loader 快 20 倍
- ✅ **增量编译** - 只编译变化的文件
- ✅ **代码分割** - 每个页面独立 bundle
- ✅ **CSS 提取** - 独立的 CSS 文件
- ✅ **TailwindCSS JIT** - 按需生成样式

### 生产构建

```bash
# 构建所有
pnpm run build:all

# 或分步构建
pnpm run build:client    # 生产版前端
pnpm run build           # 后端

# 启动生产服务器
pnpm run start:prod
```

---

## 7. 环境变量

### .env 配置

```bash
# 应用配置
NODE_ENV=development
PORT=3000
APP_NAME=yjp-nestjs

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 添加新的环境变量

1. 在 `.env.example` 中添加
2. 在 `.env` 中设置值
3. 在代码中使用：
```typescript
process.env.YOUR_VAR
```

---

## 8. 验证配置

使用验证脚本检查所有配置：

```bash
./verify.sh
```

应该看到：
```
✅ 服务器正在运行
✅ CSS 文件加载正常
✅ JS 文件加载正常
✅ SSR 正常工作
✅ 构建产物存在
```

---

## 📝 总结

- ✅ Views 自动复制已配置
- ✅ 静态资源路径正确
- ✅ 依赖已优化
- ✅ 开发工作流完善
- ✅ 所有配置已验证

项目配置完整且优化，可以开始开发了！
