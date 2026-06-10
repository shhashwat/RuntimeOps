import { Module } from '@nestjs/common';
import { DeploymentsService } from './services/deployments.service';
import { DeploymentsController } from './controllers/deployments.controller';
import { DeploymentsRepository } from './repositories';
import { BullModule } from '@nestjs/bullmq';
import { DEPLOYMENT_QUEUE } from 'src/queue/constants';
import { DeploymentQueue } from './queues';
import { DeploymentWorker } from './workers';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: DEPLOYMENT_QUEUE,
        }),
        ActivitiesModule,
    ],
    controllers: [DeploymentsController],
    providers: [
        DeploymentsService,
        DeploymentsRepository,
        DeploymentQueue,
        DeploymentWorker,
    ],
})
export class DeploymentsModule {}
