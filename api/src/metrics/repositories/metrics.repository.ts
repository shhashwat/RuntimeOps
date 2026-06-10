import { Injectable } from '@nestjs/common';

import { DeploymentStatus } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MetricsRepository {
    constructor(private readonly db: DatabaseService) {}

    async getMetrics(userId: string) {
        const [
            totalDeployments,
            successfulDeployments,
            failedDeployments,
            queuedDeployments,
        ] = await Promise.all([
            this.db.deployment.count({
                where: {
                    triggeredById: userId,
                },
            }),

            this.db.deployment.count({
                where: {
                    triggeredById: userId,

                    status: DeploymentStatus.SUCCESS,
                },
            }),

            this.db.deployment.count({
                where: {
                    triggeredById: userId,

                    status: DeploymentStatus.FAILED,
                },
            }),

            this.db.deployment.count({
                where: {
                    triggeredById: userId,

                    status: DeploymentStatus.QUEUED,
                },
            }),
        ]);

        return {
            totalDeployments,
            successfulDeployments,
            failedDeployments,
            queuedDeployments,
        };
    }
}
