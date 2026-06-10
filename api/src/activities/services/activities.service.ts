import { Injectable } from '@nestjs/common';

import { ActivitiesRepository } from '../repositories';

@Injectable()
export class ActivitiesService {
    constructor(private readonly activitiesRepository: ActivitiesRepository) {}

    async getActivities(userId: string) {
        return this.activitiesRepository.getActivities(userId);
    }

    async createActivity(data: { userId: string; type: any; message: string }) {
        return this.activitiesRepository.createActivity(data);
    }
}
