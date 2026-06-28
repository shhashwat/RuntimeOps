import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { AuthRepository } from '../repositories';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;

    const authRepository = {
        findUserByEmail: jest.fn(),
        createUser: jest.fn(),
        createRefreshToken: jest.fn(),
        findRefreshTokensByUserId: jest.fn(),
        deleteRefreshToken: jest.fn(),
        deleteAllUserRefreshTokens: jest.fn(),
        findUserById: jest.fn(),
    };

    const jwt = {
        signAsync: jest.fn(),
    };

    const config = {
        get: jest.fn((key: string) => key),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: AuthRepository,
                    useValue: authRepository,
                },
                {
                    provide: JwtService,
                    useValue: jwt,
                },
                {
                    provide: ConfigService,
                    useValue: config,
                },
            ],
        }).compile();

        service = module.get(AuthService);

        jest.resetAllMocks();
    });

    describe('register', () => {
        it('should register a user', async () => {
            authRepository.findUserByEmail.mockResolvedValue(null);

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

            authRepository.createUser.mockResolvedValue({
                id: '1',
                name: 'John',
                email: 'john@test.com',
                role: Role.DEVELOPER,
            });

            jwt.signAsync
                .mockResolvedValueOnce('access')
                .mockResolvedValueOnce('refresh');

            const result = await service.register({
                name: 'John',
                email: 'john@test.com',
                password: 'password',
            });

            expect(result.accessToken).toBe('access');
            expect(result.refreshToken).toBe('refresh');
            expect(authRepository.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'John',
                    email: 'john@test.com',
                    passwordHash: 'hashed',
                }),
            );
        });

        it('should throw when user already exists', async () => {
            authRepository.findUserByEmail.mockResolvedValue({
                id: '1',
                name: 'John',
            });

            await expect(
                service.register({
                    name: 'John',
                    email: 'john@test.com',
                    password: 'password',
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            authRepository.findUserByEmail.mockResolvedValue({
                id: '1',
                email: 'john@test.com',
                name: 'John',
                role: Role.DEVELOPER,
                passwordHash: 'hashed',
            });

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            jwt.signAsync
                .mockResolvedValueOnce('access')
                .mockResolvedValueOnce('refresh');

            const result = await service.login({
                email: 'john@test.com',
                password: 'password',
            });

            expect(result.accessToken).toBe('access');
            expect(result.refreshToken).toBe('refresh');
        });

        it('should throw if user does not exist', async () => {
            authRepository.findUserByEmail.mockResolvedValue(null);

            await expect(
                service.login({
                    email: 'john@test.com',
                    password: 'password',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw if password is invalid', async () => {
            authRepository.findUserByEmail.mockResolvedValue({
                id: '1',
                passwordHash: 'hashed',
            });

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.login({
                    email: 'john@test.com',
                    password: 'wrong',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('should delete refresh tokens', async () => {
            authRepository.deleteAllUserRefreshTokens.mockResolvedValue(
                undefined,
            );

            const result = await service.logout('1');

            expect(
                authRepository.deleteAllUserRefreshTokens,
            ).toHaveBeenCalledWith('1');

            expect(result).toEqual({
                message: 'Logged out successfully',
            });
        });
    });
});
