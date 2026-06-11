import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

import { Role } from '@prisma/client';

import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto';
import { AuthRepository } from '../repositories';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.authRepository.findUserByEmail(
            dto.email,
        );

        if (existingUser)
            throw new BadRequestException(
                `User: ${existingUser.name} already exists!`,
            );

        const passwordHash = await this.hashData(dto.password);

        const user = await this.authRepository.createUser({
            email: dto.email,
            name: dto.name,
            passwordHash,
        });

        const tokens = await this.generateTokens(
            user.id,
            user.email,
            user.role,
        );

        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.authRepository.findUserByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(
            user.id,
            user.email,
            user.role,
        );

        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const refreshTokens =
            await this.authRepository.findRefreshTokensByUserId(userId);

        let validToken = false;

        for (const storedToken of refreshTokens) {
            const matches = await bcrypt.compare(
                refreshToken,
                storedToken.tokenHash,
            );

            if (matches) {
                validToken = true;

                await this.authRepository.deleteRefreshToken(storedToken.id);

                break;
            }
        }

        if (!validToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.authRepository.findUserById(userId);

        const tokens = await this.generateTokens(
            user.id,
            user.email,
            user.role,
        );

        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const data: any = {};

        if (dto.name) {
            data.name = dto.name;
        }

        if (dto.password) {
            data.passwordHash = await this.hashData(dto.password);
        }

        return this.authRepository.updateUser(userId, data);
    }

    async logout(userId: string) {
        await this.authRepository.deleteAllUserRefreshTokens(userId);

        return {
            message: 'Logged out successfully',
        };
    }

    private async generateTokens(userId: string, email: string, role: Role) {
        const payload = {
            sub: userId,
            email,
            role,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),

                issuer: this.configService.get<string>('JWT_ISSUER'),

                audience: this.configService.get<string>('JWT_AUDIENCE'),

                expiresIn: '1d',
            }),

            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),

                issuer: this.configService.get<string>('JWT_ISSUER'),

                audience: this.configService.get<string>('JWT_AUDIENCE'),

                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async storeRefreshToken(userId: string, refreshToken: string) {
        const tokenHash = await this.hashData(refreshToken);

        const expiresAt = new Date();

        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.createRefreshToken({
            userId,
            tokenHash,
            expiresAt,
        });
    }

    private async hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
}
