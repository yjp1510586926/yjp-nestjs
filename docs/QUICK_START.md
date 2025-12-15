# 🚀 快速开始指南

本指南将帮助您快速搭建和运行 NestJS + React MPA 项目。

---

## 📋 前置要求

确保您的开发环境已安装以下工具：

- **Node.js**: >= 18.x (推荐 20.x LTS)
- **pnpm**: >= 8.x (推荐) 或 npm >= 9.x
- **Git**: 最新版本
- **数据库**: PostgreSQL / MySQL (可选)
- **Redis**: >= 6.x (可选，用于缓存)

### 检查环境

```bash
node --version    # v20.x.x
pnpm --version    # 8.x.x
git --version     # 2.x.x
```

---

## 🛠️ 项目初始化

### 步骤 1: 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 步骤 2: 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置必要的环境变量
```

**.env 配置说明**:

```bash
# 应用配置
NODE_ENV=development
PORT=3000
APP_NAME="NestJS MPA"

# 数据库配置 (如果使用)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=nestjs_mpa

# Redis 配置 (如果使用)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# 前端配置
CLIENT_URL=http://localhost:3000
```

### 步骤 3: 构建前端资源

```bash
# 开发模式 - 监听文件变化
pnpm run build:client:dev

# 或在新终端窗口运行 watch 模式
pnpm run watch:client
```

### 步骤 4: 启动开发服务器

```bash
# 启动 NestJS 服务器
pnpm run start:dev

# 服务器将在 http://localhost:3000 启动
```

### 步骤 5: 访问应用

打开浏览器访问：

- **首页**: http://localhost:3000/
- **Dashboard**: http://localhost:3000/dashboard
- **API 文档**: http://localhost:3000/api/docs (Swagger)

---

## 🏗️ 项目结构说明

```
yjp-nestjs/
├── src/                          # 后端源码
│   ├── modules/                  # 业务模块
│   │   ├── pages/               # 页面模块
│   │   │   ├── home/
│   │   │   │   ├── home.controller.ts    # 处理 /home 路由
│   │   │   │   ├── home.service.ts       # 业务逻辑
│   │   │   │   └── home.module.ts        # 模块定义
│   │   │   └── dashboard/
│   │   └── api/                 # API 模块
│   ├── common/                  # 公共代码
│   ├── config/                  # 配置文件
│   ├── views/                   # EJS 模板
│   └── main.ts                  # 应用入口
│
├── client/                       # 前端源码
│   ├── src/
│   │   ├── pages/               # 页面组件
│   │   │   ├── home/
│   │   │   │   ├── index.tsx    # 页面入口
│   │   │   │   ├── components/  # 页面专属组件
│   │   │   │   └── styles/      # 页面样式
│   │   │   └── dashboard/
│   │   ├── components/          # 共享组件
│   │   ├── hooks/               # 自定义 Hooks
│   │   ├── stores/              # 状态管理
│   │   └── styles/              # 全局样式
│   └── webpack/                 # Webpack 配置
│
└── dist/                        # 构建输出
    ├── server/                  # 后端编译结果
    └── client/                  # 前端打包结果
```

---

## 🎨 开发工作流

### 添加新页面

#### 1. 创建后端模块

```bash
# 使用 NestJS CLI 生成模块
nest g module modules/pages/about
nest g controller modules/pages/about
nest g service modules/pages/about
```

#### 2. 创建 Controller

```typescript
// src/modules/pages/about/about.controller.ts
import { Controller, Get, Render } from '@nestjs/common';
import { AboutService } from './about.service';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Render('pages/about')
  async getAboutPage() {
    const data = await this.aboutService.getPageData();
    return {
      title: 'About Us',
      initialData: JSON.stringify(data),
      bundlePath: '/static/about.bundle.js',
      cssPath: '/static/about.css'
    };
  }
}
```

#### 3. 创建 EJS 模板

```ejs
<!-- src/views/pages/about.ejs -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <link rel="stylesheet" href="<%= cssPath %>">
</head>
<body>
  <div id="root"></div>
  <script>
    window.__INITIAL_DATA__ = <%- initialData %>;
  </script>
  <script src="<%= bundlePath %>"></script>
</body>
</html>
```

#### 4. 创建 React 页面组件

```typescript
// client/src/pages/about/index.tsx
import React from 'react';
import { hydrateRoot } from 'react-dom/client';

interface AboutPageProps {
  initialData: any;
}

function AboutPage({ initialData }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          About Us
        </h1>
        <p className="text-lg text-gray-700">
          {initialData.description}
        </p>
      </div>
    </div>
  );
}

// 水合应用
const container = document.getElementById('root');
const initialData = (window as any).__INITIAL_DATA__;

if (container) {
  hydrateRoot(container, <AboutPage initialData={initialData} />);
}

export default AboutPage;
```

#### 5. 更新 Webpack 配置

```javascript
// client/webpack/webpack.common.js
module.exports = {
  entry: {
    home: './client/src/pages/home/index.tsx',
    dashboard: './client/src/pages/dashboard/index.tsx',
    about: './client/src/pages/about/index.tsx', // 新增
  },
  // ...
};
```

#### 6. 重新构建并访问

```bash
# 重新构建前端
pnpm run build:client:dev

# 访问新页面
# http://localhost:3000/about
```

---

## 🧩 创建可复用组件

### 示例：创建 Button 组件

```typescript
// client/src/components/ui/Button/index.tsx
import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
```

### 使用组件

```typescript
import { Button } from '@/components/ui/Button';

function MyPage() {
  return (
    <div>
      <Button variant="primary" size="lg" onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}
```

---

## 🔌 API 开发

### 创建 RESTful API

```typescript
// src/modules/api/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      data: user
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: user,
      message: '用户创建成功'
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      data: user,
      message: '用户更新成功'
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      success: true,
      message: '用户删除成功'
    };
  }
}
```

### 前端调用 API

```typescript
// client/src/services/api/users.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`)
};

// 使用示例
import { usersApi } from '@/services/api/users';

async function loadUsers() {
  const response = await usersApi.getAll();
  console.log(response.data);
}
```

---

## 🧪 测试

### 运行测试

```bash
# 单元测试
pnpm run test

# 监听模式
pnpm run test:watch

# 测试覆盖率
pnpm run test:cov

# E2E 测试
pnpm run test:e2e
```

### 编写测试

```typescript
// src/modules/pages/home/home.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService],
    }).compile();

    service = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return page data', async () => {
    const data = await service.getPageData();
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('description');
  });
});
```

---

## 🚀 生产部署

### 构建生产版本

```bash
# 1. 构建前端
pnpm run build:client

# 2. 构建后端
pnpm run build

# 3. 启动生产服务器
pnpm run start:prod
```

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启应用
pm2 restart all

# 停止应用
pm2 stop all
```

### Docker 部署

```bash
# 构建镜像
docker build -t nestjs-mpa .

# 运行容器
docker run -d -p 3000:3000 --name nestjs-mpa-app nestjs-mpa

# 使用 docker-compose
docker-compose up -d
```

---

## 🛠️ 常用命令

```bash
# 开发
pnpm run start:dev              # 启动开发服务器
pnpm run watch:client           # 监听前端文件变化

# 构建
pnpm run build                  # 构建后端
pnpm run build:client           # 构建前端（生产）
pnpm run build:client:dev       # 构建前端（开发）

# 测试
pnpm run test                   # 运行测试
pnpm run test:watch             # 监听模式测试
pnpm run test:cov               # 测试覆盖率

# 代码质量
pnpm run lint                   # 代码检查
pnpm run format                 # 代码格式化
pnpm run type-check             # 类型检查

# 生产
pnpm run start:prod             # 启动生产服务器
```

---

## 🐛 常见问题

### 1. 端口已被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或修改 .env 中的 PORT
```

### 2. 模块找不到

```bash
# 清除缓存并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3. Webpack 构建失败

```bash
# 清除 Webpack 缓存
rm -rf node_modules/.cache

# 重新构建
pnpm run build:client:dev
```

### 4. TypeScript 类型错误

```bash
# 重新生成类型定义
pnpm run type-check

# 检查 tsconfig.json 配置
```

---

## 📚 下一步学习

1. **阅读架构文档**: [MPA_ARCHITECTURE.md](./MPA_ARCHITECTURE.md)
2. **学习 NestJS**: [官方文档](https://docs.nestjs.com/)
3. **掌握 React**: [官方文档](https://react.dev/)
4. **深入 TailwindCSS**: [官方文档](https://tailwindcss.com/)
5. **了解 TypeScript**: [官方手册](https://www.typescriptlang.org/docs/)

---

## 💡 提示

- 使用 `pnpm` 代替 `npm` 可以节省磁盘空间并提高安装速度
- 开发时保持前端 watch 模式运行，实时编译
- 使用 VS Code 插件提升开发体验（ESLint, Prettier, Tailwind CSS IntelliSense）
- 定期运行 `pnpm run lint` 和 `pnpm run test` 确保代码质量

---

**祝您开发愉快！** 🎉
