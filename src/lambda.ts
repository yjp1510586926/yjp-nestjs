import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import type { Context, Handler } from 'aws-lambda';
import express from 'express';
import { AppModule } from './app.module';

let cachedServer: Handler;

// 从 Secrets Manager 获取配置（如果配置了）
async function loadSecrets() {
	if (process.env.DATABASE_SECRET_ARN) {
		try {
			const { SecretsManager } = await import('aws-sdk');
			const secretsManager = new SecretsManager();
			const data = await secretsManager
				.getSecretValue({ SecretId: process.env.DATABASE_SECRET_ARN })
				.promise();
			const secret = JSON.parse(data.SecretString || '{}');
			process.env.DATABASE_URL = `postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.database}`;
		} catch (error) {
			console.error('Failed to load database secret:', error);
		}
	}

	if (process.env.JWT_SECRET_ARN) {
		try {
			const { SecretsManager } = await import('aws-sdk');
			const secretsManager = new SecretsManager();
			const data = await secretsManager
				.getSecretValue({ SecretId: process.env.JWT_SECRET_ARN })
				.promise();
			const secret = JSON.parse(data.SecretString || '{}');
			process.env.JWT_SECRET = secret.secret;
		} catch (error) {
			console.error('Failed to load JWT secret:', error);
		}
	}
}

async function bootstrapServer(): Promise<Handler> {
	if (!cachedServer) {
		// 加载密钥
		await loadSecrets();

		const expressApp = express();
		const nestApp = await NestFactory.create<NestExpressApplication>(
			AppModule,
			new ExpressAdapter(expressApp),
			{
				logger:
					process.env.NODE_ENV === 'production'
						? ['error', 'warn']
						: ['error', 'warn', 'log'],
			},
		);

		// ⭐ 配置视图引擎 (Lambda 环境)
		const { join } = await import('path');
		nestApp.setBaseViewsDir(join(__dirname, '..', 'views'));
		nestApp.setViewEngine('ejs');

		// ⭐ 配置静态资源 (Lambda 环境)
		nestApp.useStaticAssets(join(__dirname, '..', 'client'), {
			prefix: '/static/',
		});

		// 全局验证管道
		nestApp.useGlobalPipes(
			new ValidationPipe({
				whitelist: false, // 暂时关闭，避免因元数据丢失导致字段被过滤
				transform: true,
			}),
		);

		// ⭐ History API Fallback - 支持 SPA 前端路由（Lambda 环境）
		expressApp.use((req: any, res: any, next: any) => {
			// 如果是 API 请求，跳过
			if (req.path.startsWith('/api')) {
				return next();
			}
			// 如果是静态资源，跳过
			if (req.path.startsWith('/static')) {
				return next();
			}
			// 如果是健康检查，跳过
			if (req.path === '/health') {
				return next();
			}
			// 如果不是文件请求（没有扩展名），重定向到根路由
			if (!req.path.includes('.')) {
				req.url = '/';
			}
			next();
		});

		// CORS 配置
		nestApp.enableCors({
			origin: process.env.CORS_ORIGIN || '*',
			credentials: true,
		});

		await nestApp.init();
		cachedServer = serverlessExpress({ app: expressApp });

		console.log('✅ NestJS application initialized for Lambda');
	}
	return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		const server = await bootstrapServer();
		return await server(event, context, () => {});
	} catch (error) {
		console.error('Lambda handler error:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal server error' }),
		};
	}
};
