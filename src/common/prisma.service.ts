import {
	Injectable,
	type OnModuleDestroy,
	type OnModuleInit,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
	private prisma: PrismaClient;
	private pool: Pool;

	constructor(private configService: ConfigService) {
		const databaseUrl = this.configService.get<string>('DATABASE_URL');

		// 创建 PostgreSQL 连接池
		this.pool = new Pool({
			connectionString: databaseUrl,
			ssl: {
				rejectUnauthorized: false, // AWS RDS 需要 SSL
			},
		});

		// 创建 Prisma adapter
		const adapter = new PrismaPg(this.pool);

		// 使用 adapter 初始化 PrismaClient
		this.prisma = new PrismaClient({
			adapter,
			log: ['query', 'info', 'warn', 'error'],
		});
	}

	async onModuleInit() {
		await this.prisma.$connect();
	}

	async onModuleDestroy() {
		await this.prisma.$disconnect();
		await this.pool.end();
	}

	// 暴露 Prisma Client 的方法
	get user() {
		return this.prisma.user;
	}

	get post() {
		return this.prisma.post;
	}

	// 暴露原始 Prisma Client（用于事务等高级操作）
	get client() {
		return this.prisma;
	}
}
