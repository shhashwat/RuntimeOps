import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Queue } from 'bullmq';

import { InjectQueue } from '@nestjs/bullmq';

import { DEPLOYMENT_QUEUE } from './queue/constants';
import { DatabaseService } from './database/database.service';
import { Public } from './auth/decorators';

@ApiTags('health')
@Controller()
export class AppController {
    constructor(
        private readonly prisma: DatabaseService,

        @InjectQueue(DEPLOYMENT_QUEUE)
        private readonly deploymentQueue: Queue,
    ) {}

    @Public()
    @Get('health')
    @ApiOperation({
        summary: 'RuntimeOps health status',
    })
    async health() {
        let database = 'disconnected';

        let redis = 'disconnected';

        let queueWorker = 'inactive';

        try {
            await this.prisma.$queryRaw`SELECT 1`;

            database = 'connected';
        } catch {}

        try {
            await this.deploymentQueue.getJobCounts();

            redis = 'connected';

            queueWorker = 'active';
        } catch {}

        return {
            status: 'healthy',

            timestamp: new Date().toISOString(),

            services: {
                api: 'healthy',

                database,

                redis,

                queueWorker,
            },
        };
    }
}
