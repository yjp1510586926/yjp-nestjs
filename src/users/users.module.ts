import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RenderService } from '../common/render.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService, PrismaService, RenderService],
	exports: [UsersService],
})
export class UsersModule {}
