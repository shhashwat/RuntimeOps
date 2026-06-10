import { Module } from '@nestjs/common';

import { ActivitiesController } from './controllers';

import { ActivitiesRepository } from './repositories';

import { ActivitiesService } from './services';

@Module({
    controllers: [ActivitiesController],

    providers: [ActivitiesRepository, ActivitiesService],

    exports: [ActivitiesService],
})
export class ActivitiesModule {}
