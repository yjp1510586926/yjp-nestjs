# 🚀 NestJS + React MPA 项目

一个现代化的多页应用（MPA）架构，结合 NestJS 后端和 React 前端，提供高性能、SEO 友好的服务端渲染解决方案。

## ✨ 核心特性

- ⚡ **服务端渲染 (SSR)**: NestJS 渲染 React 组件为 HTML，首屏快速加载
- � **MPA 架构**: 每个页面独立打包，按需加载
- �🎨 **TailwindCSS**: 现代化原子化 CSS，精美 UI 设计
- 📦 **TypeScript 全栈**: 完整的类型安全支持
- � **SWC 编译**: 比传统编译器快 20 倍
- � **客户端水合**: React 无缝接管，提供交互性
- 📱 **响应式设计**: 移动端优先，完美适配各种屏幕
- 📊 **Swagger 文档**: 自动生成 API 文档
- 🐳 **Docker 支持**: 完整的容器化部署方案

## 🛠️ 技术栈

### 后端

- **框架**: NestJS 10.x
- **语言**: TypeScript 5.x
- **模板引擎**: EJS
- **验证**: class-validator + class-transformer
- **文档**: Swagger/OpenAPI
- **配置**: @nestjs/config

### 前端

- **框架**: React 18.x
- **语言**: TypeScript 5.x
- **样式**: TailwindCSS 3.x
- **编译器**: SWC (超快速)
- **构建工具**: Webpack 5.x
- **渲染**: SSR + Client Hydration

### 开发工具

- **包管理**: pnpm (推荐)
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **热更新**: Webpack Watch + NestJS Watch

## 📋 前置要求

- Node.js >= 18.x
- pnpm >= 8.x (推荐) 或 npm >= 9.x

## 🚀 快速开始

### 方式 1: 使用自动化脚本（推荐）

```bash
# 1. 克隆项目
git clone <repository-url>
cd yjp-nestjs

# 2. 运行初始化脚本
./setup.sh
```

脚本会自动：

- ✅ 安装依赖
- ✅ 创建 .env 文件
- ✅ 构建前端和后端
- ✅ 准备就绪

### 方式 2: 手动安装

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.example .env

# 3. 构建前端
pnpm run build:client

# 4. 启动开发服务器
pnpm run start:dev
```

### 开发模式（推荐）

使用两个终端获得最佳开发体验：

```bash
# 终端 1: 监听前端变化，自动重新编译
pnpm run watch:client

# 终端 2: 监听后端变化，自动重启服务器
pnpm run start:dev
```

修改代码后：

1. 等待 2-3 秒（自动编译）
2. 刷新浏览器（Cmd+R）
3. 看到更新 ✅

### 访问应用

- 🏠 **首页**: http://localhost:3000
- 📚 **API 文档**: http://localhost:3000/api/docs
- 💚 **健康检查**: http://localhost:3000/health

## 📖 文档

完整文档位于 `docs/` 目录：

- 📚 [文档索引](./docs/README.md) - 所有文档导航
- 🚀 [快速开始](./docs/QUICK_START.md) - 详细开发指南
- 🏗️ [架构设计](./docs/MPA_ARCHITECTURE.md) - 项目架构详解
- 🔧 [技术选型](./docs/TECH_STACK.md) - 技术决策说明
- ⚛️ [SSR 实现](./docs/SSR_IMPLEMENTATION.md) - 服务端渲染详解
- ⚙️ [配置指南](./docs/CONFIGURATION.md) - 配置和问题排查

## 📁 项目结构

```
yjp-nestjs/
├── src/                      # 后端源码
│   ├── common/              # 公共模块
│   │   └── render.service.ts # SSR 渲染服务
│   ├── views/               # EJS 模板
│   │   └── pages/           # 页面模板
│   ├── app.controller.ts    # 应用控制器
│   ├── app.service.ts       # 应用服务
│   └── main.ts              # 应用入口
│
├── client/                   # 前端源码
│   ├── src/
│   │   └── pages/           # 页面组件
│   │       └── home/        # 首页
│   │           ├── HomePage.tsx    # 共享组件
│   │           ├── index.tsx       # 客户端入口
│   │           └── styles.css      # 页面样式
│   └── webpack/             # Webpack 配置
│       ├── webpack.common.js
│       ├── webpack.dev.js
│       └── webpack.prod.js
│
├── docs/                     # 项目文档
├── dist/                     # 构建输出
│   ├── src/                 # 编译后的后端
│   ├── client/              # 编译后的前端
│   └── views/               # 复制的模板
│
├── .env.example             # 环境变量模板
├── .swcrc                   # SWC 配置
├── nest-cli.json            # NestJS CLI 配置
├── tailwind.config.js       # TailwindCSS 配置
├── tsconfig.json            # TypeScript 配置（后端）
├── tsconfig.client.json     # TypeScript 配置（前端）
├── setup.sh                 # 初始化脚本
└── verify.sh                # 验证脚本
```

## 🏗️ 构建

```bash
# 构建前端
pnpm run build:client

# 构建后端
pnpm run build

# 构建全部
pnpm run build:app
```

## 🚀 部署

### 使用 Node.js

```bash
# 1. 构建项目
pnpm run build:app

# 2. 启动生产服务器
pnpm run start:prod
```

### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status
```

### 使用 Docker

```bash
# 构建镜像
docker build -t nestjs-mpa .

# 运行容器
docker run -d -p 3000:3000 nestjs-mpa

# 使用 docker-compose
docker-compose up -d
```

## 常用命令

```bash
# 开发
pnpm run start:dev          # 启动开发服务器
pnpm run watch:client       # 监听前端文件变化

# 构建
pnpm run build              # 构建后端
pnpm run build:client       # 构建前端
pnpm run build:app          # 构建全部

# 代码质量
pnpm run lint               # 代码检查
pnpm run type-check         # 类型检查

# 生产
pnpm run start:prod         # 启动生产服务器

# 验证
./verify.sh                 # 验证项目配置
```

## 🎯 核心功能

### 服务端渲染 (SSR)

- ✅ React 组件在服务端渲染为 HTML
- ✅ 首屏快速加载，SEO 友好
- ✅ 客户端水合，提供完整交互
- ✅ 无水合错误，完美匹配

### 开发体验

- ✅ SWC 超快速编译
- ✅ 热更新（修改后自动编译）
- ✅ TypeScript 类型安全
- ✅ ESLint + Prettier 代码规范
- ✅ 完整的错误提示

### 性能优化

- ✅ 代码分割（每个页面独立 bundle）
- ✅ CSS 提取（独立的 CSS 文件）
- ✅ TailwindCSS JIT（按需生成）
- ✅ 增量编译（只编译变化的文件）
- ✅ 生产环境压缩优化

## 📝 添加新页面

1. **创建 EJS 模板**

```bash
touch src/views/pages/about.ejs
```

2. **创建 React 组件**

```bash
mkdir -p client/src/pages/about
touch client/src/pages/about/AboutPage.tsx
touch client/src/pages/about/index.tsx
```

3. **添加 Webpack 入口**

```javascript
// client/webpack/webpack.common.js
entry: {
  home: './client/src/pages/home/index.tsx',
  about: './client/src/pages/about/index.tsx', // 新增
}
```

4. **添加路由**

```typescript
// src/app.controller.ts
@Get('about')
@Render('pages/about')
getAbout() {
  return { title: '关于我们' };
}
```

详细步骤请查看 [快速开始文档](./docs/QUICK_START.md)。

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [NestJS](https://nestjs.com/) - 渐进式 Node.js 框架
- [React](https://react.dev/) - 用于构建用户界面的 JavaScript 库
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [SWC](https://swc.rs/) - 超快速 TypeScript/JavaScript 编译器

---

**Happy Coding!** 🎉

**项目版本**: v1.0.0  
**最后更新**: 2025-12-15
