import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { DatabaseService } from 'src/database/database.service';

import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        private readonly databaseService: DatabaseService,
    ) {
        const jwtAccessSecret = config.get<string>('JWT_ACCESS_SECRET');
        if (!jwtAccessSecret)
            throw new InternalServerErrorException(
                'JWT_ACCESS_SECRET is not defined',
            );
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtAccessSecret,
            issuer: config.get<string>('JWT_ISSUER'),
            audience: config.get<string>('JWT_AUDIENCE'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}
