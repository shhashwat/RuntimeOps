import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { User } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthRepository {
    constructor(private readonly db: DatabaseService) {}

    async findUserByEmail(email: string) {
        return this.db.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findUserById(id: string) {
        const user = await this.db.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async createUser(data: {
        email: string;
        name: string;
        passwordHash: string;
    }): Promise<User> {
        const existingUser = await this.findUserByEmail(data.email);

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        return this.db.user.create({
            data: {
                email: data.email,
                name: data.name,
                passwordHash: data.passwordHash,
            },
        });
    }

    async createRefreshToken(data: {
        userId: string;
        tokenHash: string;
        expiresAt: Date;
    }) {
        return this.db.refreshToken.create({
            data,
        });
    }

    async findRefreshTokensByUserId(userId: string) {
        return this.db.refreshToken.findMany({
            where: {
                userId,
            },
        });
    }

    async deleteRefreshToken(id: string) {
        return this.db.refreshToken.delete({
            where: {
                id,
            },
        });
    }

    async deleteAllUserRefreshTokens(userId: string) {
        return this.db.refreshToken.deleteMany({
            where: {
                userId,
            },
        });
    }
}
