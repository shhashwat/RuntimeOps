import { Global, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { BullModule } from '@nestjs/bullmq';

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],

            inject: [ConfigService],

            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>('REDIS_HOST'),

                    port: Number(configService.get<string>('REDIS_PORT')),
                },
            }),
        }),
    ],

    exports: [BullModule],
})
export class QueueModule {}
