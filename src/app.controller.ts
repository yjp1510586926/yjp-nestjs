import { Controller, Get, Inject, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(@Inject(AppService) _appService: AppService) {}

	@Get('/') // SPA 入口路由
	@Render('index')
	renderApp() {
		const urlPrefix = process.env.URL_PREFIX || '';
		return {
			title: 'YJP 用户管理系统',
			initialData: JSON.stringify({ message: 'Hello from NestJS!' }),
			appHtml: '', // SSR 内容（如果没有 SSR 则为空）
			cssPath: `${urlPrefix}/static/main.css`,
			vendorsPath: `${urlPrefix}/static/vendors.js`,
			bundlePath: `${urlPrefix}/static/main.js`,
		};
	}

	@Get('health')
	getHealth() {
		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
		};
	}
}
