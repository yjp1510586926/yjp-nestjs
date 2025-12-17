import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client'), // 本地开发时指向 ../client/dist? 不，打包后是 ./client
			serveRoot: '/static',
			exclude: ['/api/(.*)'],
		}),
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService, PrismaService],
	exports: [PrismaService],
})
export class AppModule {}
