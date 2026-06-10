import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { DeploymentStatus, LogLevel } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DeploymentsRepository {
    constructor(private readonly db: DatabaseService) {}

    async createDeployment(userId: string, projectId: string) {
        const project = await this.db.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (project.createdById !== userId) {
            throw new NotFoundException('Project not found');
        }

        return this.db.deployment.create({
            data: {
                projectId,
                triggeredById: userId,
                status: DeploymentStatus.QUEUED,
                targetEnvironment: project.environment,
            },
        });
    }

    async getDeployments(userId: string) {
        return this.db.deployment.findMany({
            where: {
                triggeredById: userId,
            },

            include: {
                project: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getDeploymentById(userId: string, deploymentId: string) {
        const deployment = await this.db.deployment.findUnique({
            where: {
                id: deploymentId,
            },

            include: {
                project: true,
                logs: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!deployment) {
            throw new NotFoundException('Deployment not found');
        }

        if (deployment.triggeredById !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return deployment;
    }

    async updateDeploymentStatus(
        deploymentId: string,
        status: DeploymentStatus,
    ) {
        return this.db.deployment.update({
            where: {
                id: deploymentId,
            },

            data: {
                status,

                completedAt:
                    status === DeploymentStatus.SUCCESS ? new Date() : null,
            },
        });
    }

    async createDeploymentLog(data: {
        deploymentId: string;
        message: string;
        level?: LogLevel;
    }) {
        const count = await this.db.deploymentLog.count({
            where: {
                deploymentId: data.deploymentId,
            },
        });
        return this.db.deploymentLog.create({
            data: {
                deploymentId: data.deploymentId,
                sequence: count + 1,
                message: data.message,

                level: data.level ?? LogLevel.INFO,
            },
        });
    }

    async getDeploymentLogs(userId: string, deploymentId: string) {
        await this.getDeploymentById(userId, deploymentId);

        return this.db.deploymentLog.findMany({
            where: {
                deploymentId,
            },

            orderBy: {
                createdAt: 'asc',
            },
        });
    }
}
