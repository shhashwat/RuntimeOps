import { Module } from '@nestjs/common';

import { MetricsController } from './controllers';

import { MetricsRepository } from './repositories';

import { MetricsService } from './services';

@Module({
    controllers: [MetricsController],

    providers: [MetricsRepository, MetricsService],
})
export class MetricsModule {}
