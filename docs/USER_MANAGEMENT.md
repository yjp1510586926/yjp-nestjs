# 用户管理系统 - CRUD 完整实现

## 📋 功能概述

这是一个完整的用户管理系统，实现了标准的 CRUD（增删改查）功能，包括：

- ✅ **创建用户** - 添加新用户，支持邮箱、姓名、密码
- ✅ **查询用户** - 查看所有用户列表和单个用户详情
- ✅ **更新用户** - 编辑用户信息
- ✅ **删除用户** - 删除指定用户

## 🎯 访问地址

- **用户管理页面**: http://localhost:3000/users/manage
- **API 文档**: http://localhost:3000/api/docs

## 🏗️ 技术架构

### 后端 (NestJS)

- **框架**: NestJS 10.x
- **ORM**: Prisma 7.x (使用 PostgreSQL Adapter)
- **数据库**: PostgreSQL (AWS RDS)
- **验证**: class-validator
- **密码加密**: bcrypt

### 前端

- **模板引擎**: EJS
- **样式**: 原生 CSS (渐变、动画、响应式)
- **交互**: 原生 JavaScript (Fetch API)

## 📁 项目结构

```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts    # 创建用户数据验证
│   │   └── update-user.dto.ts    # 更新用户数据验证
│   ├── users.controller.ts       # 用户控制器 (路由)
│   ├── users.service.ts          # 用户服务 (业务逻辑)
│   └── users.module.ts           # 用户模块
├── views/
│   └── users/
│       └── index.ejs             # 用户管理页面
├── common/
│   └── prisma.service.ts         # Prisma 数据库服务
└── app.module.ts                 # 主应用模块
```

## 🔌 API 接口

### 1. 获取所有用户

```http
GET /users/api
```

**响应示例**:

```json
[
  {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "张三",
    "role": "USER",
    "createdAt": "2025-12-16T05:00:00.000Z",
    "updatedAt": "2025-12-16T05:00:00.000Z"
  }
]
```

### 2. 获取单个用户

```http
GET /users/api/:id
```

### 3. 创建用户

```http
POST /users/api
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "张三",
  "password": "123456"
}
```

**字段说明**:

- `email` (必填): 用户邮箱，必须唯一
- `name` (可选): 用户姓名
- `password` (必填): 密码，至少6位

### 4. 更新用户

```http
PATCH /users/api/:id
Content-Type: application/json

{
  "email": "newemail@example.com",
  "name": "李四",
  "password": "newpassword"
}
```

**注意**: 所有字段都是可选的，只更新提供的字段

### 5. 删除用户

```http
DELETE /users/api/:id
```

## 🎨 前端功能

### 用户界面特性

- 🎯 **现代化设计**: 渐变背景、卡片式布局、毛玻璃效果
- 📱 **响应式布局**: 完美适配桌面和移动设备
- ✨ **流畅动画**: 页面加载、表单提交、删除确认等动画效果
- 🔔 **实时提示**: 操作成功/失败的即时反馈
- 📝 **表单验证**: 前端实时验证，后端二次验证

### 交互功能

1. **添加用户**: 点击"添加用户"按钮，填写表单
2. **编辑用户**: 点击表格中的"编辑"按钮
3. **删除用户**: 点击"删除"按钮，确认后删除
4. **自动刷新**: 操作成功后自动刷新列表

## 🗄️ 数据库配置

### Prisma Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]

  @@map("users")
}
```

### 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表 (需要数据库连接)
npx prisma migrate dev --name init

# 查看数据库
npx prisma studio
```

## 🚀 启动项目

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

确保 `.env` 文件中配置了正确的数据库连接：

```env
DATABASE_URL="postgresql://postgres:yjp105009@database-aws-yjp.cluster-c9c6k0iaqvbr.us-west-2.rds.amazonaws.com:5432/postgres?schema=public"
```

### 3. 启动开发服务器

```bash
npm run start:dev
```

### 4. 访问应用

打开浏览器访问: http://localhost:3000/users/manage

## 🔒 安全特性

1. **密码加密**: 使用 bcrypt 加密存储，不存储明文密码
2. **数据验证**:
   - 前端: HTML5 验证 + JavaScript 验证
   - 后端: class-validator 验证
3. **错误处理**: 统一的异常处理和错误提示
4. **SQL 注入防护**: Prisma ORM 自动防护

## 📝 使用示例

### 创建第一个用户

1. 访问 http://localhost:3000/users/manage
2. 点击"➕ 添加用户"按钮
3. 填写表单:
   - 邮箱: admin@example.com
   - 姓名: 管理员
   - 密码: admin123
4. 点击"保存"

### 编辑用户

1. 在用户列表中找到要编辑的用户
2. 点击"✏️ 编辑"按钮
3. 修改信息（密码留空则不修改）
4. 点击"保存"

### 删除用户

1. 在用户列表中找到要删除的用户
2. 点击"🗑️ 删除"按钮
3. 确认删除操作

## ⚠️ 注意事项

1. **数据库连接**: 确保 AWS RDS 数据库可访问
2. **网络安全组**: 检查 RDS 安全组是否允许当前 IP 访问
3. **密码强度**: 生产环境建议使用更强的密码策略
4. **权限控制**: 当前版本未实现身份认证，建议添加 JWT 认证

## 🛠️ 故障排查

### 问题: 数据库连接失败

```
Error: P1001: Can't reach database server
```

**解决方案**:

1. 检查数据库 URL 是否正确
2. 确认 RDS 安全组允许当前 IP
3. 测试网络连接: `telnet database-aws-yjp.cluster-c9c6k0iaqvbr.us-west-2.rds.amazonaws.com 5432`

### 问题: 页面显示"加载失败"

**解决方案**:

1. 检查后端服务是否运行
2. 打开浏览器控制台查看错误信息
3. 确认数据库表已创建

### 问题: 创建用户失败

**可能原因**:

- 邮箱已存在（唯一约束）
- 密码少于6位
- 数据库连接问题

## 📊 数据库表结构

| 字段      | 类型     | 说明       | 约束       |
| --------- | -------- | ---------- | ---------- |
| id        | String   | 用户ID     | 主键, CUID |
| email     | String   | 邮箱       | 唯一, 必填 |
| name      | String   | 姓名       | 可选       |
| password  | String   | 密码(加密) | 必填       |
| role      | Enum     | 角色       | USER/ADMIN |
| createdAt | DateTime | 创建时间   | 自动       |
| updatedAt | DateTime | 更新时间   | 自动       |

## 🎯 下一步优化建议

1. **身份认证**: 添加 JWT 登录认证
2. **权限管理**: 实现基于角色的访问控制 (RBAC)
3. **分页功能**: 用户列表分页显示
4. **搜索过滤**: 按邮箱、姓名搜索用户
5. **批量操作**: 批量删除、导出用户
6. **头像上传**: 支持用户头像上传
7. **密码重置**: 忘记密码功能
8. **操作日志**: 记录用户操作历史

## 📞 技术支持

如有问题，请检查:

- 服务器日志: 查看终端输出
- 浏览器控制台: 查看前端错误
- 数据库日志: 查看 Prisma 查询日志

---

**开发时间**: 2025-12-16  
**技术栈**: NestJS + Prisma + PostgreSQL + EJS  
**状态**: ✅ 开发完成，等待数据库连接测试
