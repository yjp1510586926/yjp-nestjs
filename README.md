# 🚀 NestJS + React SPA 项目

一个现代化的单页应用（SPA）架构，结合 NestJS 后端 API 和 React 前端，提供高性能的全栈开发解决方案。

## ✨ 核心特性

- ⚡ **SPA 架构**: React Router 客户端路由，流畅的页面切换体验
- 🎨 **TailwindCSS**: 现代化原子化 CSS，精美 UI 设计
- 📦 **TypeScript 全栈**: 完整的类型安全支持，前后端类型共享
- ⚙️ **SWC 编译**: 比传统编译器快 20 倍，极速开发体验
- 🗄️ **Prisma ORM**: 类型安全的数据库访问，智能查询生成
- 📱 **响应式设计**: 移动端优先，完美适配各种屏幕
- � **Biome**: 现代化的代码检查和格式化工具
- ☁️ **AWS Lambda 支持**: 可选的 Serverless 部署方案

## 🛠️ 技术栈

### 后端

- **框架**: NestJS 10.x
- **语言**: TypeScript 5.x
- **ORM**: Prisma 7.x
- **数据库**: PostgreSQL
- **模板引擎**: EJS (用于 HTML 入口)
- **验证**: class-validator + class-transformer
- **配置**: @nestjs/config
- **部署**: PM2 / AWS Lambda

### 前端

- **框架**: React 18.x
- **路由**: React Router 7.x
- **语言**: TypeScript 5.x
- **样式**: TailwindCSS 3.x
- **编译器**: SWC (超快速)
- **构建工具**: Webpack 5.x
- **渲染**: 客户端渲染 (CSR)

### 开发工具

- **包管理**: npm/yarn (支持 pnpm)
- **代码规范**: Biome (替代 ESLint + Prettier)
- **类型检查**: TypeScript
- **热更新**: Webpack Watch + NestJS Watch

## 📋 前置要求

- Node.js >= 18.x
- npm >= 9.x 或 yarn >= 1.22.x (也支持 pnpm)
- PostgreSQL >= 14.x (如需本地数据库开发)

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
- ✅ 生成 Prisma Client
- ✅ 构建前端和后端
- ✅ 准备就绪

### 方式 2: 手动安装

```bash
# 1. 安装依赖
npm install
# 或使用 yarn
yarn install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 3. 生成 Prisma Client
npx prisma generate

# 4. 构建前端
npm run build:client

# 5. 启动开发服务器
npm run start:dev
```

### 开发模式（推荐）

项目支持并行开发模式，前后端自动热更新：

```bash
# 使用 npm-run-all 同时启动前后端开发
npm run start:dev
```

这个命令会自动并行运行：

- **前端监听** (`client:watch`): 自动编译 React 代码
- **后端监听** (`nest:watch`): 自动重启 NestJS 服务

或者手动在两个终端运行：

```bash
# 终端 1: 监听前端变化，自动重新编译
npm run watch:client

# 终端 2: 监听后端变化，自动重启服务器
npm run nest:watch
```

修改代码后：

1. 前后端自动检测变化并重新编译
2. 等待 2-3 秒
3. 刷新浏览器（Cmd+R）查看更新 ✅

### 访问应用

- 🏠 **首页**: http://localhost:3000
- � **用户管理**: http://localhost:3000/users
- 🔍 **GitHub Token**: http://localhost:3000/github
- 💚 **健康检查**: http://localhost:3000/health

## 📖 相关文档

如需了解更多信息，请查看：

- 📚 架构设计说明
- 🚀 Prisma 数据库设计
- ⚛️ React Router 路由配置
- ☁️ AWS Lambda 部署指南

## 📁 项目结构

```
yjp-nestjs/
├── src/                      # 后端源码
│   ├── common/              # 公共模块
│   │   └── prisma.service.ts # Prisma 数据库服务
│   ├── users/               # 用户模块
│   │   ├── dto/             # 数据传输对象
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── views/               # EJS 模板
│   │   └── index.ejs        # SPA 入口 HTML
│   ├── app.controller.ts    # 应用控制器
│   ├── app.module.ts        # 应用模块
│   ├── app.service.ts       # 应用服务
│   ├── main.ts              # 应用入口
│   └── lambda.ts            # AWS Lambda 处理器
│
├── client/                   # 前端源码
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   ├── home/        # 首页
│   │   │   ├── users/       # 用户管理页
│   │   │   └── github/      # GitHub Token 页
│   │   ├── components/      # 公共组件 (待添加)
│   │   ├── styles/          # 全局样式
│   │   │   └── global.css   # TailwindCSS 入口
│   │   ├── config/          # 配置文件
│   │   │   └── api.ts       # API 配置
│   │   └── index.tsx        # React 应用入口 (SPA)
│   ├── public/              # 静态资源
│   │   └── favicon.png
│   └── webpack/             # Webpack 配置
│       ├── webpack.common.js
│       ├── webpack.dev.js
│       └── webpack.prod.js
│
├── prisma/                   # Prisma 数据库
│   └── schema.prisma        # 数据库模型定义
│
├── dist/                     # 构建输出
│   ├── src/                 # 编译后的后端
│   ├── client/              # 编译后的前端
│   └── views/               # 复制的 EJS 模板
│
├── .env                     # 环境变量 (需创建)
├── .swcrc                   # SWC 编译器配置
├── biome.json               # Biome 代码规范配置
├── nest-cli.json            # NestJS CLI 配置
├── tailwind.config.js       # TailwindCSS 配置
├── postcss.config.js        # PostCSS 配置
├── tsconfig.json            # TypeScript 配置 (后端)
├── package.json             # 项目依赖
└── ecosystem.config.js      # PM2 部署配置
```

## 🏗️ 构建

```bash
# 构建前端
npm run build:client

# 构建后端
npm run build

# 构建全部（推荐生产环境）
npm run build:app
```

## 🚀 部署

### 使用 Node.js

```bash
# 1. 构建项目
npm run build:app

# 2. 启动生产服务器
npm run start:prod
```

### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs nestjs-mpa
```

### 使用 AWS Lambda (Serverless)

```bash
# 1. 配置 AWS CLI 和 SAM CLI
# 2. 构建并部署
./deploy.sh

# 详细说明请查看 template.yaml 和 lambda-build.sh
```

## 常用命令

```bash
# 开发
npm run start:dev           # 并行启动前后端开发服务器
npm run nest:watch          # 仅启动后端（监听模式）
npm run watch:client        # 仅监听前端文件变化

# 构建
npm run build               # 构建后端
npm run build:client        # 构建前端
npm run build:app           # 构建全部

# 代码质量
npm run lint                # Biome 代码检查
npm run lint:fix            # 自动修复代码问题
npm run type-check          # TypeScript 类型检查

# 数据库 (Prisma)
npx prisma generate         # 生成 Prisma Client
npx prisma migrate dev      # 运行数据库迁移（开发）
npx prisma studio           # 打开 Prisma Studio (数据库 GUI)

# 生产
npm run start:prod          # 启动生产服务器

# 清理
npm run clean               # 清理构建文件和缓存
```

## 🎯 核心功能

### SPA 客户端路由

- ✅ React Router 7.x 客户端路由
- ✅ 无刷新页面切换，流畅用户体验
- ✅ 支持路由嵌套和动态路由
- ✅ 自动处理 404 页面重定向

### 数据库集成 (Prisma)

- ✅ 类型安全的数据库查询
- ✅ 自动生成 TypeScript 类型
- ✅ 内置数据迁移管理
- ✅ Prisma Studio 可视化管理

### 开发体验

- ✅ SWC 超快速编译（比 Babel 快 20x）
- ✅ 热更新（前后端自动重载）
- ✅ TypeScript 全栈类型安全
- ✅ Biome 现代化代码检查和格式化
- ✅ 完整的错误提示和类型推导

### 性能优化

- ✅ Webpack 5 优化打包
- ✅ CSS 提取（独立的 CSS 文件）
- ✅ TailwindCSS JIT（按需生成）
- ✅ 增量编译（只编译变化的文件）
- ✅ 生产环境代码压缩和优化

## 📝 开发新功能

### 添加新的前端页面

1. **创建页面组件**

```bash
mkdir -p client/src/pages/about
touch client/src/pages/about/AboutPage.tsx
```

```typescript
// client/src/pages/about/AboutPage.tsx
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold">关于我们</h1>
      <Link to="/" className="text-blue-500 hover:underline">
        返回首页
      </Link>
    </div>
  );
}
```

2. **添加路由**

```typescript
// client/src/index.tsx
import { AboutPage } from './pages/about/AboutPage';

// 在 Routes 中添加
<Route path="/about" element={<AboutPage />} />
```

3. **测试页面**

访问 `http://localhost:3000/about` 查看新页面

### 添加新的后端 API

1. **创建模块**

```bash
npx nest g module features
npx nest g controller features
npx nest g service features
```

2. **实现业务逻辑**

```typescript
// src/features/features.controller.ts
import { Controller, Get } from "@nestjs/common";

@Controller("api/features")
export class FeaturesController {
  @Get()
  findAll() {
    return { features: ["Feature 1", "Feature 2"] };
  }
}
```

3. **在前端调用**

```typescript
// 前端页面中
const response = await fetch("/api/features");
const data = await response.json();
```

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
- [React Router](https://reactrouter.com/) - React 声明式路由
- [Prisma](https://www.prisma.io/) - 下一代 Node.js ORM
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [SWC](https://swc.rs/) - 超快速 TypeScript/JavaScript 编译器
- [Biome](https://biomejs.dev/) - 现代化的代码检查和格式化工具

---

**Happy Coding!** 🎉

**项目版本**: v1.0.0  
**架构模式**: SPA (单页应用)  
**最后更新**: 2025-12-23
