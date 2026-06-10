import { Injectable } from '@nestjs/common';

import { DeploymentsRepository } from '../repositories';
import { DeploymentQueue } from '../queues';
import { ActivitiesService } from 'src/activities/services';

@Injectable()
export class DeploymentsService {
    constructor(
        private readonly deploymentsRepository: DeploymentsRepository,
        private readonly deploymentQueue: DeploymentQueue,
        private readonly activitiesService: ActivitiesService,
    ) {}

    async createDeployment(userId: string, projectId: string) {
        const deployment = await this.deploymentsRepository.createDeployment(
            userId,
            projectId,
        );

        await this.deploymentQueue.addDeploymentJob(deployment.id);

        await this.activitiesService.createActivity({
            userId,
            type: 'DEPLOYMENT_TRIGGERED',
            message: `Deployment triggered for project "${deployment.projectId}"`,
        });

        return deployment;
    }

    async getDeployments(userId: string) {
        return this.deploymentsRepository.getDeployments(userId);
    }

    async getDeploymentById(userId: string, deploymentId: string) {
        return this.deploymentsRepository.getDeploymentById(
            userId,
            deploymentId,
        );
    }

    async getDeploymentLogs(userId: string, deploymentId: string) {
        return this.deploymentsRepository.getDeploymentLogs(
            userId,
            deploymentId,
        );
    }
}
