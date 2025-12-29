import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IUser } from 'src/entities/user';
import bcrypt from 'bcrypt';
import { createUserDTO } from 'src/dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async createUser({ email, name, password }: Omit<createUserDTO, 'token'>): Promise<{ id: number }> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.prismaService.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }, select: { id: true }
        })
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.prismaService.user.findFirstOrThrow({
            where: {
                email
            },
        })
    }

    async getUserById(id: number): Promise<IUser> {
        return await this.prismaService.user.findFirstOrThrow({
            where: { id }
        })
    }

    async updatePasswordUser(id: number, newPassword: string) {
        await this.prismaService.user.update({
            where: { id },
            data: { password: newPassword }
        })
    }

    async delete(id: number) {
        return await this.prismaService.user.delete({
            where: { id }
        })
    }

    async getAll() {
        return await this.prismaService.user.findMany({
            select: {
                id: true,
                name: true,
                role: true,
            }
        })
    }
}
