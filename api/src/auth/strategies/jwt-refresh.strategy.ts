import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { DatabaseService } from 'src/database/database.service';

import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        private readonly config: ConfigService,
        private readonly databaseService: DatabaseService,
    ) {
        const jwtRefreshSecret = config.get<string>('JWT_REFRESH_SECRET');
        if (!jwtRefreshSecret)
            throw new InternalServerErrorException(
                'JWT_REFRESH_SECRET is not defined',
            );
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: jwtRefreshSecret,
            issuer: config.get<string>('JWT_ISSUER'),
            audience: config.get<string>('JWT_AUDIENCE'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: JwtPayload) {
        const refreshToken = request.headers.authorization?.replace(
            'Bearer ',
            '',
        );

        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload.sub,
            },
            select: {
                id: true,
                name: true,
                role: true,
            },
        });

        if (!user || !refreshToken) {
            throw new UnauthorizedException();
        }

        return {
            ...user,
            refreshToken,
        };
    }
}
