import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHomeData() {
		return {
			message: '欢迎使用 NestJS + React 多页应用',
			description: '现代化的多页应用架构解决方案',
			features: [
				'基于 NestJS 的服务端渲染',
				'React 客户端水合技术',
				'TailwindCSS 样式系统',
				'TypeScript 类型安全保障',
			],
		};
	}
}
