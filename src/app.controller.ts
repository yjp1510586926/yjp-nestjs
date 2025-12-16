import { Controller, Get, Render } from '@nestjs/common';
import type { AppService } from './app.service';
import type { RenderService } from './common/render.service';

@Controller()
export class AppController {
	constructor(
		_appService: AppService,
		private readonly renderService: RenderService,
	) {}

	@Get()
	@Render('pages/home')
	getHome() {
		const appHtml = this.renderService.renderHomePage({});

		return {
			title: 'YJP 管理平台',
			initialData: JSON.stringify({}),
			appHtml,
			bundlePath: '/static/home.js',
			cssPath: '/static/home.css',
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
