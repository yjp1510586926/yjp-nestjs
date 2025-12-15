# 🎯 技术选型与架构决策

本文档详细说明了 NestJS + React MPA 项目的技术选型理由和架构决策。

---

## 📊 技术选型对比

### 1. 后端框架选择

| 框架 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **NestJS** ✅ | • TypeScript 原生支持<br>• 模块化架构<br>• 依赖注入<br>• 丰富的生态系统<br>• 企业级最佳实践 | • 学习曲线较陡<br>• 相对较重 | **已选择**: 提供完整的企业级解决方案，适合大型项目 |
| Express | • 轻量灵活<br>• 生态成熟<br>• 学习成本低 | • 缺少标准架构<br>• 需要自己组织代码 | 不适合大型项目的标准化需求 |
| Fastify | • 性能优异<br>• 插件系统 | • 生态相对较小<br>• 社区不如 Express | 性能优势不足以弥补生态劣势 |
| Koa | • 中间件优雅<br>• 轻量级 | • 功能较少<br>• 需要大量配置 | 缺少开箱即用的功能 |

### 2. 前端框架选择

| 框架 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **React** ✅ | • 生态系统最大<br>• 灵活性高<br>• 社区活跃<br>• 就业市场需求大 | • 需要额外的状态管理<br>• 配置相对复杂 | **已选择**: 最成熟的解决方案，适合 MPA 场景 |
| Vue | • 学习曲线平缓<br>• 官方生态完整<br>• 性能优秀 | • 企业级应用较少<br>• 生态不如 React | 在 MPA 场景下优势不明显 |
| Svelte | • 性能最优<br>• 代码简洁 | • 生态较小<br>• 企业应用少 | 生态不够成熟 |
| Angular | • 完整的框架<br>• TypeScript 原生 | • 学习曲线陡峭<br>• 过于重量级 | 对 MPA 场景过于复杂 |

### 3. 样式方案选择

| 方案 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **TailwindCSS** ✅ | • 原子化 CSS<br>• 高度可定制<br>• 开发效率高<br>• 打包体积小 | • HTML 类名较长<br>• 学习成本 | **已选择**: 最适合现代化开发的方案 |
| CSS Modules | • 作用域隔离<br>• 传统 CSS 写法 | • 需要写大量 CSS<br>• 维护成本高 | 开发效率不如 Tailwind |
| Styled Components | • CSS-in-JS<br>• 动态样式方便 | • 运行时开销<br>• 打包体积大 | 性能不如 Tailwind |
| Sass/Less | • 功能强大<br>• 生态成熟 | • 需要预处理<br>• 维护成本高 | 不如原子化 CSS 高效 |

### 4. 状态管理选择

| 方案 | 优势 | 劣势 | 选择理由 |
|------|------|------|----------|
| **Zustand** ✅ | • 轻量简洁<br>• API 简单<br>• 性能优秀<br>• TypeScript 友好 | • 生态相对较小 | **推荐**: 适合中小型状态管理 |
| Redux Toolkit | • 生态最大<br>• 工具完善<br>• 可预测性强 | • 样板代码多<br>• 学习成本高 | 备选方案，适合复杂状态 |
| Jotai | • 原子化状态<br>• 性能优秀 | • 概念较新<br>• 生态较小 | 对于 MPA 场景过于复杂 |
| MobX | • 响应式<br>• 易于使用 | • 魔法较多<br>• 调试困难 | 不够显式和可控 |

### 5. 数据库选择

| 数据库 | 优势 | 劣势 | 选择理由 |
|--------|------|------|----------|
| **PostgreSQL** ✅ | • 功能强大<br>• ACID 完整<br>• JSON 支持<br>• 扩展性好 | • 配置复杂<br>• 资源占用较高 | **推荐**: 企业级首选 |
| MySQL | • 性能优秀<br>• 生态成熟<br>• 易于使用 | • 功能相对较少 | 备选方案 |
| MongoDB | • 灵活的文档模型<br>• 水平扩展好 | • 事务支持弱<br>• 数据一致性差 | 不适合关系型数据 |
| SQLite | • 轻量级<br>• 零配置 | • 并发能力弱<br>• 功能有限 | 仅适合开发环境 |

### 6. ORM 选择

| ORM | 优势 | 劣势 | 选择理由 |
|-----|------|------|----------|
| **TypeORM** ✅ | • NestJS 官方推荐<br>• 功能完整<br>• 装饰器语法<br>• 迁移工具 | • 性能一般<br>• 文档不够完善 | **推荐**: 与 NestJS 集成最好 |
| Prisma | • 类型安全<br>• 开发体验好<br>• 性能优秀 | • 相对较新<br>• 灵活性稍差 | 备选方案，适合新项目 |
| Sequelize | • 生态成熟<br>• 功能强大 | • API 复杂<br>• TypeScript 支持弱 | 不够现代化 |

---

## 🏗️ 架构决策

### 1. 为什么选择 MPA 而不是 SPA？

#### MPA 优势

✅ **SEO 友好**: 每个页面都是完整的 HTML，搜索引擎可以直接抓取  
✅ **首屏加载快**: 只加载当前页面所需的资源  
✅ **代码隔离**: 不同页面的代码互不影响  
✅ **渐进增强**: 即使 JavaScript 失败，页面仍可访问  
✅ **缓存策略**: 可以针对不同页面设置不同的缓存策略  

#### SPA 劣势

❌ **SEO 困难**: 需要额外的 SSR 或预渲染方案  
❌ **首屏慢**: 需要加载整个应用的 JavaScript  
❌ **复杂度高**: 需要处理路由、状态管理等  
❌ **内存占用**: 长时间运行可能导致内存泄漏  

#### 适用场景

**MPA 适合**:
- 内容型网站（博客、新闻、电商）
- 企业官网
- 营销页面
- SEO 要求高的项目

**SPA 适合**:
- 后台管理系统
- 复杂的交互应用
- 实时协作工具
- 单页面游戏

### 2. 服务端渲染 (SSR) vs 客户端渲染 (CSR)

我们采用 **混合模式**:

```
服务端渲染 HTML → 客户端 React 水合 → 后续交互由客户端处理
```

**优势**:
- ✅ 首屏快速显示（SSR）
- ✅ SEO 友好（SSR）
- ✅ 交互流畅（CSR）
- ✅ 渐进增强（SSR + CSR）

### 3. Monorepo vs Multi-repo

我们采用 **Monorepo** 结构:

```
yjp-nestjs/
├── src/          # 后端代码
└── client/       # 前端代码
```

**优势**:
- ✅ 代码共享方便（类型定义、工具函数）
- ✅ 统一的依赖管理
- ✅ 简化的 CI/CD 流程
- ✅ 原子化提交（前后端同步更新）

**劣势**:
- ❌ 构建时间可能较长
- ❌ 权限管理相对复杂

**解决方案**:
- 使用 Webpack 缓存加速构建
- 使用 pnpm workspace 管理依赖
- 使用 Turborepo 优化构建流程（可选）

### 4. REST API vs GraphQL

我们采用 **RESTful API**:

**选择理由**:
- ✅ 简单直观，学习成本低
- ✅ 缓存策略成熟（HTTP 缓存）
- ✅ 工具链完善（Swagger、Postman）
- ✅ 适合 CRUD 操作

**GraphQL 的问题**:
- ❌ 学习曲线陡峭
- ❌ 缓存复杂
- ❌ 对于简单的 CRUD 过于复杂
- ❌ N+1 查询问题

**何时考虑 GraphQL**:
- 需要灵活的数据查询
- 多个客户端有不同的数据需求
- 需要实时订阅功能

### 5. JWT vs Session

我们采用 **JWT (JSON Web Token)**:

**优势**:
- ✅ 无状态，易于扩展
- ✅ 跨域友好
- ✅ 移动端友好
- ✅ 微服务架构友好

**实现方案**:
```typescript
// Access Token: 短期有效（1小时）
// Refresh Token: 长期有效（7天）
// 双 Token 机制，平衡安全性和用户体验
```

**安全措施**:
- ✅ HTTPS 传输
- ✅ HttpOnly Cookie 存储 Refresh Token
- ✅ CSRF 保护
- ✅ Token 黑名单（Redis）

---

## 🎨 设计系统决策

### 1. 原子化 CSS (TailwindCSS)

**选择理由**:
- ✅ 开发效率高（无需命名 CSS 类）
- ✅ 打包体积小（PurgeCSS 移除未使用的样式）
- ✅ 一致性好（设计系统内置）
- ✅ 响应式简单（内置断点）
- ✅ 暗黑模式支持

**最佳实践**:
```typescript
// ❌ 避免：内联大量类名
<div className="flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">

// ✅ 推荐：提取为组件
<Button variant="primary">Click me</Button>
```

### 2. 组件库策略

我们采用 **自建组件库** + **第三方库补充**:

**自建组件**:
- Button, Input, Modal, Card 等基础组件
- 完全符合设计系统
- 轻量级，按需加载

**第三方库**:
- 复杂组件（日期选择器、富文本编辑器）
- 使用 Headless UI / Radix UI
- 保持样式一致性

### 3. 响应式设计

**移动端优先**:
```css
/* 默认样式（移动端） */
.container { padding: 1rem; }

/* 平板 */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container { padding: 3rem; }
}
```

**TailwindCSS 断点**:
```typescript
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

<div className="p-4 md:p-6 lg:p-8">
```

---

## 🚀 性能优化策略

### 1. 代码分割

**页面级分割**:
```javascript
// webpack.config.js
entry: {
  home: './client/src/pages/home/index.tsx',
  dashboard: './client/src/pages/dashboard/index.tsx',
  // 每个页面独立打包
}
```

**组件级分割**:
```typescript
// 动态导入
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### 2. 缓存策略

**静态资源缓存**:
```typescript
// 文件名哈希
output: {
  filename: '[name].[contenthash].js',
  // 文件内容变化时，哈希变化，缓存失效
}

// HTTP 缓存头
Cache-Control: public, max-age=31536000, immutable
```

**API 缓存**:
```typescript
// Redis 缓存
@CacheKey('user-profile')
@CacheTTL(3600)
async getUserProfile() {
  // 缓存 1 小时
}
```

### 3. 图片优化

**策略**:
- ✅ 使用 WebP 格式
- ✅ 响应式图片（srcset）
- ✅ 懒加载（Intersection Observer）
- ✅ CDN 加速
- ✅ 图片压缩

```typescript
<img
  src="image.webp"
  srcSet="image-320w.webp 320w, image-640w.webp 640w"
  sizes="(max-width: 640px) 100vw, 640px"
  loading="lazy"
  alt="Description"
/>
```

### 4. 打包优化

**Webpack 配置**:
```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
      },
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
      },
    },
  },
}
```

---

## 🔐 安全策略

### 1. 认证与授权

**JWT 双 Token 机制**:
```typescript
// Access Token: 存储在内存中
// Refresh Token: 存储在 HttpOnly Cookie 中

// 优势：
// - Access Token 泄露影响小（短期有效）
// - Refresh Token 无法被 JavaScript 访问（HttpOnly）
```

### 2. 输入验证

**后端验证**:
```typescript
// 使用 class-validator
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}
```

**前端验证**:
```typescript
// 使用 Zod / Yup
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### 3. XSS 防护

**策略**:
- ✅ React 自动转义
- ✅ Content Security Policy (CSP)
- ✅ DOMPurify 清理 HTML
- ✅ 避免 dangerouslySetInnerHTML

### 4. CSRF 防护

**策略**:
```typescript
// 使用 CSRF Token
@UseGuards(CsrfGuard)
@Post('api/users')
createUser() {
  // CSRF Token 验证
}
```

### 5. SQL 注入防护

**策略**:
```typescript
// ✅ 使用 ORM 参数化查询
await userRepository.findOne({ where: { email } });

// ❌ 避免：字符串拼接
await query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 📊 监控与日志

### 1. 日志系统

**Winston 配置**:
```typescript
// 日志级别
// error: 错误
// warn: 警告
// info: 信息
// debug: 调试

// 日志输出
// - 控制台（开发环境）
// - 文件（生产环境）
// - 远程服务（Sentry、LogRocket）
```

### 2. 性能监控

**指标**:
- ✅ 响应时间
- ✅ 吞吐量
- ✅ 错误率
- ✅ CPU/内存使用率

**工具**:
- APM: New Relic / DataDog
- 错误追踪: Sentry
- 日志聚合: ELK Stack

### 3. 用户行为分析

**工具**:
- Google Analytics
- Mixpanel
- Hotjar

---

## 🧪 测试策略

### 测试金字塔

```
        ┌─────────────┐
        │   E2E (10%) │  Playwright
        ├─────────────┤
        │ Integration │  Supertest
        │    (30%)    │
        ├─────────────┤
        │    Unit     │  Jest
        │    (60%)    │
        └─────────────┘
```

### 测试覆盖率目标

- **总体**: > 80%
- **核心业务逻辑**: > 90%
- **工具函数**: > 95%

---

## 📝 总结

本项目的技术选型遵循以下原则：

1. **成熟稳定**: 选择经过验证的技术栈
2. **开发效率**: 优先考虑开发体验和效率
3. **性能优先**: 关注用户体验和性能指标
4. **可维护性**: 代码清晰，易于维护和扩展
5. **安全第一**: 内置安全最佳实践
6. **渐进增强**: 支持逐步升级和优化

这些决策为项目的长期发展奠定了坚实的基础。

---

**文档版本**: v1.0.0  
**最后更新**: 2025-12-15
