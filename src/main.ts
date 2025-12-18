// 移除顶部的 ignore，因为它没用
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	// app.setGlobalPrefix("api"); // 撤销，让根路径服务页面

	// 配置视图引擎
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.setViewEngine('ejs');

	// 配置静态资源
	app.useStaticAssets(join(__dirname, '..', 'client'), {
		prefix: '/static/',
	});

	// ⭐ History API Fallback - 支持 SPA 前端路由
	// 所有非 API、非静态资源的请求都重定向到根路由，让前端路由处理
	app.use((req: any, res: any, next: any) => {
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

	// 全局验证管道
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: false,
			transform: true,
		}),
	);

	// CORS 配置
	app.enableCors({
		origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
		credentials: true,
	});

	// Swagger API 文档
	if (process.env.SWAGGER_ENABLED === 'true') {
		const config = new DocumentBuilder()
			.setTitle('NestJS MPA API')
			.setDescription('NestJS + React MPA Application API Documentation')
			.setVersion('1.0')
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup(process.env.SWAGGER_PATH || 'api/docs', app, document);
	}

	const port = process.env.PORT || 3000;
	await app.listen(port);

	// 优雅关闭处理
	app.enableShutdownHooks();

	console.log(`🚀 Application is running on: http://localhost:${port}`);
	console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
	console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
	if (process.env.VPC_SUBNETS) {
		console.log(`🔒 VPC Deployment: ${process.env.VPC_SUBNETS}`);
	}
}

bootstrap();
