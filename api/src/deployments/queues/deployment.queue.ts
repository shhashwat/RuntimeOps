import { InjectQueue } from '@nestjs/bullmq';

import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';
import { DEPLOYMENT_QUEUE } from 'src/queue/constants';

@Injectable()
export class DeploymentQueue {
    constructor(
        @InjectQueue(DEPLOYMENT_QUEUE)
        private readonly queue: Queue,
    ) {}

    async addDeploymentJob(deploymentId: string) {
        return this.queue.add(
            'process-deployment',

            {
                deploymentId,
            },

            {
                attempts: 3,

                backoff: {
                    type: 'exponential',
                    delay: 3000,
                },

                removeOnComplete: 50,

                removeOnFail: 20,
            },
        );
    }
}
