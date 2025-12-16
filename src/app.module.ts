import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';
import { RenderService } from './common/render.service';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService, RenderService, PrismaService],
	exports: [PrismaService],
})
export class AppModule {}
