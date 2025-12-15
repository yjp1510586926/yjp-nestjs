# 🗄️ Prisma + AWS Aurora 配置指南

本项目使用 Prisma ORM 连接 AWS Aurora PostgreSQL 数据库。

---

## 📋 前置要求

- AWS 账号
- AWS RDS Aurora PostgreSQL 实例
- 数据库连接信息

---

## 🚀 快速配置

### 1. 环境变量配置

在 `.env` 文件中添加数据库连接字符串：

```bash
# AWS Aurora PostgreSQL 连接
DATABASE_URL="postgresql://username:password@your-aurora-endpoint.region.rds.amazonaws.com:5432/database_name?schema=public"

# 示例
# DATABASE_URL="postgresql://admin:MySecurePassword123@myapp-aurora.us-east-1.rds.amazonaws.com:5432/myapp?schema=public"
```

### 2. 生成 Prisma Client

```bash
npx prisma generate
```

### 3. 运行迁移

```bash
# 创建迁移
npx prisma migrate dev --name init

# 应用迁移到生产环境
npx prisma migrate deploy
```

---

## 🏗️ AWS Aurora 配置

### 创建 Aurora 实例

1. **登录 AWS Console**
2. **进入 RDS 服务**
3. **创建数据库**
   - 引擎类型: Amazon Aurora
   - 版本: PostgreSQL Compatible
   - 模板: 开发/测试（或生产）
   - DB 实例标识符: `myapp-aurora`
   - 主用户名: `admin`
   - 主密码: 设置强密码

4. **配置连接**
   - VPC: 选择您的 VPC
   - 公开访问: 是（开发环境）/ 否（生产环境）
   - VPC 安全组: 配置允许 5432 端口

5. **其他配置**
   - 数据库名称: `myapp`
   - 端口: `5432`
   - 备份保留期: 7 天（推荐）

### 安全组配置

允许您的 IP 访问数据库：

```
类型: PostgreSQL
协议: TCP
端口: 5432
源: 您的 IP 地址 或 0.0.0.0/0（仅开发）
```

---

## 📝 Prisma Schema

当前 schema 包含示例模型：

```prisma
// 用户模型
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

// 文章模型
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔧 使用 Prisma Service

### 在 Controller 中使用

```typescript
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './common/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.user.findMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }
}
```

### 创建用户

```typescript
async createUser(data: { email: string; name: string; password: string }) {
  return this.prisma.user.create({
    data: {
      ...data,
      role: 'USER',
    },
  });
}
```

### 使用事务

```typescript
async createUserWithPost(userData: any, postData: any) {
  return this.prisma.client.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    const post = await tx.post.create({
      data: {
        ...postData,
        authorId: user.id,
      },
    });
    return { user, post };
  });
}
```

---

## 🔄 数据库迁移

### 开发环境

```bash
# 创建新迁移
npx prisma migrate dev --name add_user_model

# 重置数据库（危险！）
npx prisma migrate reset
```

### 生产环境

```bash
# 应用迁移
npx prisma migrate deploy

# 查看迁移状态
npx prisma migrate status
```

---

## 🛠️ Prisma Studio

可视化数据库管理工具：

```bash
npx prisma studio
```

访问 http://localhost:5555 查看和编辑数据。

---

## 📊 性能优化

### 1. 连接池配置

```typescript
// src/common/prisma.service.ts
this.prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
  // 连接池配置
  datasourceUrl: `${databaseUrl}?connection_limit=10&pool_timeout=20`,
});
```

### 2. 查询优化

```typescript
// 使用 select 只获取需要的字段
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
  },
});

// 使用 include 预加载关联数据
const userWithPosts = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
});
```

### 3. 批量操作

```typescript
// 批量创建
await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1', password: 'hash1' },
    { email: 'user2@example.com', name: 'User 2', password: 'hash2' },
  ],
});

// 批量更新
await prisma.user.updateMany({
  where: { role: 'USER' },
  data: { updatedAt: new Date() },
});
```

---

## 🔒 安全最佳实践

### 1. 环境变量

```bash
# 开发环境
DATABASE_URL="postgresql://dev_user:dev_pass@localhost:5432/dev_db"

# 生产环境（使用 AWS Secrets Manager）
DATABASE_URL="${AWS_SECRET_DATABASE_URL}"
```

### 2. 密码加密

```typescript
import * as bcrypt from 'bcrypt';

async createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return this.prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}
```

### 3. SQL 注入防护

Prisma 自动防护 SQL 注入，但仍需注意：

```typescript
// ✅ 安全 - 使用参数化查询
await prisma.user.findMany({
  where: { email: userInput },
});

// ❌ 危险 - 不要使用原始 SQL
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`;

// ✅ 安全 - 使用 Prisma.sql
await prisma.$queryRaw(
  Prisma.sql`SELECT * FROM users WHERE email = ${userInput}`
);
```

---

## 🐛 常见问题

### Q: 连接超时？

**A**: 检查安全组配置和 VPC 设置

```bash
# 测试连接
psql -h your-aurora-endpoint.region.rds.amazonaws.com -U admin -d myapp
```

### Q: 迁移失败？

**A**: 检查数据库权限

```sql
-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE myapp TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
```

### Q: 性能慢？

**A**: 
1. 检查查询是否有索引
2. 使用 Prisma Studio 查看查询计划
3. 启用查询日志分析

---

## 📚 相关资源

- [Prisma 文档](https://www.prisma.io/docs)
- [AWS Aurora 文档](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/)
- [Prisma + NestJS](https://docs.nestjs.com/recipes/prisma)

---

**配置完成！** 🎉

现在您可以使用 Prisma 连接 AWS Aurora 数据库了。
