import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { PrismaService } from '../common/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto) {
		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		return this.prisma.user.create({
			data: {
				email: createUserDto.email,
				name: createUserDto.name,
				password: hashedPassword,
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async findAll() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async findOne(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			throw new NotFoundException(`用户 #${id} 不存在`);
		}

		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		await this.findOne(id); // 检查用户是否存在

		const data: Prisma.UserUpdateInput = {};
		if (updateUserDto.email) data.email = updateUserDto.email;
		if (updateUserDto.name) data.name = updateUserDto.name;
		if (updateUserDto.password) {
			data.password = await bcrypt.hash(updateUserDto.password, 10);
		}

		return this.prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async remove(id: string) {
		await this.findOne(id); // 检查用户是否存在

		return this.prisma.user.delete({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}
}
