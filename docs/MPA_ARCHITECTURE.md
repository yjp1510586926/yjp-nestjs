# NestJS + React MPA 项目架构文档

## 📋 项目概述

本项目是一个基于 **NestJS** 后端 + **React** 前端的多页应用（MPA）架构，采用服务端渲染（SSR）和客户端水合（Hydration）的混合模式，提供高性能、SEO 友好的 Web 应用解决方案。

### 技术栈

- **后端框架**: NestJS 10.x
- **前端框架**: React 18.x
- **样式方案**: TailwindCSS 3.x
- **构建工具**: Webpack 5.x
- **模板引擎**: EJS / Handlebars
- **状态管理**: Zustand / Redux Toolkit
- **HTTP 客户端**: Axios
- **类型系统**: TypeScript 5.x
- **包管理器**: pnpm (推荐) / npm / yarn

---

## 🏗️ 项目架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Page A    │  │  Page B    │  │  Page C    │            │
│  │  (React)   │  │  (React)   │  │  (React)   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Backend                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controllers Layer                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Page A   │  │ Page B   │  │  API     │           │  │
│  │  │Controller│  │Controller│  │Controller│           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Services Layer                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ User     │  │ Auth     │  │ Product  │           │  │
│  │  │ Service  │  │ Service  │  │ Service  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Layer                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │TypeORM/  │  │  Redis   │  │External  │           │  │
│  │  │Prisma    │  │  Cache   │  │   API    │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
yjp-nestjs/
├── src/
│   ├── modules/                    # 业务模块
│   │   ├── pages/                  # 页面模块
│   │   │   ├── home/
│   │   │   │   ├── home.controller.ts
│   │   │   │   ├── home.service.ts
│   │   │   │   ├── home.module.ts
│   │   │   │   └── dto/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── ...
│   │   ├── auth/                   # 认证模块
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │   ├── user/                   # 用户模块
│   │   └── api/                    # API 模块
│   ├── common/                     # 公共模块
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   └── utils/
│   ├── config/                     # 配置
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── webpack.config.ts
│   ├── views/                      # 服务端模板
│   │   ├── layouts/
│   │   │   ├── main.ejs
│   │   │   └── admin.ejs
│   │   └── pages/
│   │       ├── home.ejs
│   │       ├── dashboard.ejs
│   │       └── ...
│   ├── main.ts                     # 应用入口
│   └── app.module.ts               # 根模块
├── client/                         # 前端代码
│   ├── src/
│   │   ├── pages/                  # 页面组件
│   │   │   ├── home/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   └── styles/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── ...
│   │   ├── components/             # 共享组件
│   │   │   ├── ui/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Header/
│   │   │   │   ├── Footer/
│   │   │   │   └── Sidebar/
│   │   │   └── common/
│   │   ├── hooks/                  # 自定义 Hooks
│   │   ├── stores/                 # 状态管理
│   │   ├── services/               # API 服务
│   │   ├── utils/                  # 工具函数
│   │   ├── types/                  # TypeScript 类型
│   │   ├── styles/                 # 全局样式
│   │   │   ├── globals.css
│   │   │   └── tailwind.css
│   │   └── constants/              # 常量
│   ├── public/                     # 静态资源
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   └── webpack/                    # Webpack 配置
│       ├── webpack.common.js
│       ├── webpack.dev.js
│       └── webpack.prod.js
├── dist/                           # 构建输出
├── docs/                           # 文档
├── test/                           # 测试
├── .env                            # 环境变量
├── .env.example
├── package.json
├── tsconfig.json
├── tsconfig.client.json
├── nest-cli.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🔄 MPA 工作流程

### 1. 服务端渲染流程

```
用户请求 → NestJS Controller → Service 获取数据 → 
渲染 EJS 模板 → 注入初始数据 → 返回 HTML → 
浏览器加载 → React 水合 → 客户端接管
```

### 2. 页面生命周期

```typescript
// 1. 服务端：Controller 处理请求
@Controller('home')
export class HomeController {
  @Get()
  @Render('pages/home')
  async getHomePage() {
    const initialData = await this.homeService.getInitialData();
    return {
      title: 'Home Page',
      initialData: JSON.stringify(initialData),
      bundlePath: '/static/home.bundle.js'
    };
  }
}

// 2. 模板：EJS 渲染 HTML
<!-- views/pages/home.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel="stylesheet" href="/static/home.css">
</head>
<body>
  <div id="root"></div>
  <script>
    window.__INITIAL_DATA__ = <%- initialData %>;
  </script>
  <script src="<%= bundlePath %>"></script>
</body>
</html>

// 3. 客户端：React 水合
// client/src/pages/home/index.tsx
import { hydrateRoot } from 'react-dom/client';

const initialData = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById('root'),
  <HomePage initialData={initialData} />
);
```

---

## 🎨 样式架构

### TailwindCSS 配置策略

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './client/src/**/*.{js,jsx,ts,tsx}',
    './src/views/**/*.ejs'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... 自定义色板
        },
        brand: {
          DEFAULT: '#3b82f6',
          dark: '#1e40af'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
};
```

### 样式组织

```
client/src/styles/
├── globals.css              # 全局样式
├── tailwind.css             # Tailwind 入口
├── variables.css            # CSS 变量
├── animations.css           # 动画定义
└── utilities.css            # 自定义工具类
```

---

## 🔌 API 设计

### RESTful API 规范

```typescript
// 页面数据 API
GET    /api/pages/:pageName/data        # 获取页面初始数据
POST   /api/pages/:pageName/action      # 页面交互动作

// 业务 API
GET    /api/users                       # 获取用户列表
GET    /api/users/:id                   # 获取用户详情
POST   /api/users                       # 创建用户
PUT    /api/users/:id                   # 更新用户
DELETE /api/users/:id                   # 删除用户

// 认证 API
POST   /api/auth/login                  # 登录
POST   /api/auth/logout                 # 登出
POST   /api/auth/refresh                # 刷新 Token
GET    /api/auth/profile                # 获取当前用户信息
```

### API 响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "timestamp": 1702656000000
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在",
    "details": { ... }
  },
  "timestamp": 1702656000000
}

// 分页响应
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## 🔐 认证与授权

### JWT 认证流程

```typescript
// 1. 登录获取 Token
POST /api/auth/login
{
  "username": "user@example.com",
  "password": "password123"
}

// 响应
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}

// 2. 使用 Token 访问受保护资源
GET /api/users/profile
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// 3. Token 过期后刷新
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 权限守卫

```typescript
// 角色守卫示例
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  @Get('dashboard')
  @Render('pages/admin/dashboard')
  getDashboard() {
    // 仅管理员可访问
  }
}
```

---

## 📦 构建与部署

### Webpack 多入口配置

```javascript
// webpack/webpack.common.js
const entries = {
  home: './client/src/pages/home/index.tsx',
  dashboard: './client/src/pages/dashboard/index.tsx',
  profile: './client/src/pages/profile/index.tsx'
};

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    filename: '[name].[contenthash].js',
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new WebpackManifestPlugin()
  ]
};
```

### 部署流程

```bash
# 1. 构建前端资源
npm run build:client

# 2. 构建后端代码
npm run build:server

# 3. 启动生产服务器
npm run start:prod

# 或使用 PM2
pm2 start ecosystem.config.js
```

---

## 🚀 性能优化

### 1. 代码分割

- 按页面分割：每个页面独立的 bundle
- 按需加载：动态 import 组件
- 共享依赖：提取公共库到 vendor chunk

### 2. 缓存策略

```typescript
// HTTP 缓存
@Controller('static')
export class StaticController {
  @Get('*')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  serveStatic() {
    // 静态资源缓存一年
  }
}

// Redis 缓存
@Injectable()
export class CacheService {
  async getPageData(pageId: string) {
    const cached = await this.redis.get(`page:${pageId}`);
    if (cached) return JSON.parse(cached);
    
    const data = await this.fetchPageData(pageId);
    await this.redis.setex(`page:${pageId}`, 3600, JSON.stringify(data));
    return data;
  }
}
```

### 3. 图片优化

- 使用 WebP 格式
- 响应式图片（srcset）
- 懒加载（Intersection Observer）
- CDN 加速

### 4. CSS 优化

- PurgeCSS 移除未使用的样式
- CSS Modules 避免冲突
- Critical CSS 内联首屏样式

---

## 🧪 测试策略

### 测试金字塔

```
        ┌─────────────┐
        │   E2E Tests │  (10%)
        ├─────────────┤
        │ Integration │  (30%)
        │    Tests    │
        ├─────────────┤
        │    Unit     │  (60%)
        │    Tests    │
        └─────────────┘
```

### 测试工具

- **单元测试**: Jest + Testing Library
- **集成测试**: Supertest
- **E2E 测试**: Playwright / Cypress
- **类型检查**: TypeScript

```typescript
// 单元测试示例
describe('HomeService', () => {
  it('should return initial data', async () => {
    const service = new HomeService();
    const data = await service.getInitialData();
    expect(data).toHaveProperty('title');
  });
});

// E2E 测试示例
test('home page loads correctly', async ({ page }) => {
  await page.goto('/home');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

---

## 📊 监控与日志

### 日志系统

```typescript
// 使用 Winston
import { Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async processData() {
    this.logger.log('Processing data...');
    try {
      // 业务逻辑
      this.logger.debug('Data processed successfully');
    } catch (error) {
      this.logger.error('Failed to process data', error.stack);
    }
  }
}
```

### 性能监控

- **APM**: New Relic / DataDog
- **错误追踪**: Sentry
- **日志聚合**: ELK Stack
- **指标收集**: Prometheus + Grafana

---

## 🔧 开发工具链

### 代码质量

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

### Git Hooks (Husky)

```bash
# .husky/pre-commit
npm run lint
npm run type-check

# .husky/commit-msg
npx commitlint --edit $1
```

---

## 🌐 国际化 (i18n)

```typescript
// 后端配置
import { I18nModule } from 'nestjs-i18n';

I18nModule.forRoot({
  fallbackLanguage: 'zh-CN',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    watch: true
  }
});

// 前端使用
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

---

## 📝 最佳实践

### 1. 代码组织

- 按功能模块划分，而非技术层
- 保持单一职责原则
- 使用依赖注入

### 2. 状态管理

- 服务端数据通过 props 传递
- 客户端状态使用 Zustand/Redux
- 避免过度使用全局状态

### 3. 错误处理

- 统一的错误处理中间件
- 友好的错误提示
- 完整的错误日志

### 4. 安全性

- CSRF 保护
- XSS 防护
- SQL 注入防护
- 速率限制
- HTTPS 强制

---

## 🎯 下一步行动

1. **初始化项目**: 运行脚手架命令
2. **配置环境**: 设置数据库、Redis 等
3. **开发首页**: 实现第一个 MPA 页面
4. **集成认证**: 实现用户登录系统
5. **完善组件库**: 构建可复用的 UI 组件
6. **性能优化**: 实施缓存和代码分割
7. **部署上线**: 配置 CI/CD 流程

---

## 📚 参考资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [React 官方文档](https://react.dev/)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Webpack 配置指南](https://webpack.js.org/configuration/)

---

**文档版本**: v1.0.0  
**最后更新**: 2025-12-15  
**维护者**: 前端架构团队
