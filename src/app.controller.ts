import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { RenderService } from './common/render.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly renderService: RenderService,
  ) {}

  @Get()
  @Render('pages/home')
  getHome() {
    const initialData = this.appService.getHomeData();
    const appHtml = this.renderService.renderHomePage(initialData);
    
    return {
      title: '欢迎使用 NestJS MPA',
      initialData: JSON.stringify(initialData),
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
