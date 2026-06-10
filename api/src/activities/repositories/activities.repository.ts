import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ActivitiesRepository {
    constructor(private readonly db: DatabaseService) {}

    async getActivities(userId: string) {
        return this.db.activity.findMany({
            where: {
                userId,
            },

            orderBy: {
                createdAt: 'desc',
            },

            take: 25,
        });
    }

    async createActivity(data: { userId: string; type: any; message: string }) {
        return this.db.activity.create({
            data,
        });
    }
}
