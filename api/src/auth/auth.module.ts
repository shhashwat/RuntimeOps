import { Module, Global } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';
import { JwtAuthGuard, JwtRefreshGuard } from './guards';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthRepository } from './repositories';

function getJwtConfig(configService: ConfigService): JwtModuleOptions {
    return {
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
            expiresIn: configService.get(
                'JWT_ACCESS_EXPIRES_IN',
            ) as jwt.SignOptions['expiresIn'],
            issuer: configService.get('JWT_ISSUER'),
            audience: configService.get('JWT_AUDIENCE'),
        },
    };
}

@Global()
@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
            useFactory: getJwtConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        JwtStrategy,
        JwtRefreshStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    exports: [AuthService, AuthRepository, JwtModule],
})
export class AuthModule {}
