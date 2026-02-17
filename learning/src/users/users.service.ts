import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.users.findUnique({ where: { email } });
    }

    async validatePassword(user: any, password: string) {
        return bcrypt.compare(password, user.password_hash);
    }

    async createUser(email: string, password: string, displayName: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.users.create({
            data: {
                id: randomUUID(),
                email,
                password_hash: hashedPassword,
                displayName:"User",
            },
        });
    }

    async findById(id: string) {
        return this.prisma.users.findUnique({ where: { id } });
    }

    async checkUserExists(email: string) {
        const user = await this.prisma.users.findUnique({ where: { email } });
        return !!user;
    }
}
