import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { ActivityType, DeploymentStatus, LogLevel } from '@prisma/client';

import { DeploymentsRepository } from '../repositories';

import { DeploymentJob } from '../interfaces';
import { DEPLOYMENT_QUEUE } from 'src/queue/constants';
import { ActivitiesService } from 'src/activities/services';
import { DatabaseService } from 'src/database/database.service';

@Processor(DEPLOYMENT_QUEUE)
export class DeploymentWorker extends WorkerHost {
    private readonly logger = new Logger(DeploymentWorker.name);

    constructor(
        private readonly deploymentsRepository: DeploymentsRepository,
        private readonly activitiesService: ActivitiesService,
        private readonly db: DatabaseService,
    ) {
        super();
    }

    async process(job: Job<DeploymentJob>) {
        const { deploymentId } = job.data;

        await this.runStage(deploymentId, DeploymentStatus.BUILDING, [
            'Pulling repository...',
            'Installing dependencies...',
            'Building application...',
        ]);

        await this.runStage(deploymentId, DeploymentStatus.DEPLOYING, [
            'Provisioning container...',
            'Deploying services...',
        ]);

        await this.runStage(deploymentId, DeploymentStatus.HEALTH_CHECK, [
            'Running health checks...',
            'Verifying API health...',
        ]);

        const deployment = await this.db.deployment.findUnique({
            where: {
                id: deploymentId,
            },
            select: {
                triggeredById: true,
                project: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        await this.activitiesService.createActivity({
            userId: deployment!.triggeredById,
            type: ActivityType.DEPLOYMENT_STATUS_CHANGED,
            message: `Deployment started for ${deployment!.project.name}`,
        });

        await this.deploymentsRepository.updateDeploymentStatus(
            deploymentId,
            DeploymentStatus.SUCCESS,
        );

        await this.deploymentsRepository.createDeploymentLog({
            deploymentId,
            level: LogLevel.INFO,
            message: 'Deployment completed successfully',
        });

        await this.activitiesService.createActivity({
            userId: deployment!.triggeredById,
            type: ActivityType.DEPLOYMENT_SUCCEEDED,
            message: `Deployment successful for ${deployment!.project.name}`,
        });
    }

    private async runStage(
        deploymentId: string,
        status: DeploymentStatus,
        logs: string[],
    ) {
        await this.deploymentsRepository.updateDeploymentStatus(
            deploymentId,
            status,
        );

        for (const log of logs) {
            await this.deploymentsRepository.createDeploymentLog({
                deploymentId,
                message: log,
            });

            await this.sleep(2000);
        }
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`Deployment job completed: ${job.id}`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, err: Error) {
        this.logger.error(`Deployment job failed: ${job?.id}`, err.stack);
    }
}
