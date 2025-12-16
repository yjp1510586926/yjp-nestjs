import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	Render,
} from '@nestjs/common';
import { RenderService } from '../common/render.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(
		@Inject(UsersService) private readonly usersService: UsersService,
		@Inject(RenderService) private readonly renderService: RenderService,
	) {}

	// 渲染用户管理页面 (React SSR)
	@Get('manage')
	@Render('pages/users')
	async renderManagePage() {
		const appHtml = this.renderService.renderUsersPage();

		return {
			title: '用户管理',
			appHtml,
			vendorsPath: '/static/vendors.js', // Webpack splitChunks 生成的公共依赖
			bundlePath: '/static/users.js',
			cssPath: '/static/users.css',
		};
	}

	// API: 创建用户
	@Post('api')
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	// API: 获取所有用户
	@Get('api')
	findAll() {
		return this.usersService.findAll();
	}

	// API: 获取单个用户
	@Get('api/:id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	// API: 更新用户
	@Patch('api/:id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	// API: 删除用户
	@Delete('api/:id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}
}
