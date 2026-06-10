import { Injectable } from '@nestjs/common';

import { MetricsRepository } from '../repositories';

@Injectable()
export class MetricsService {
    constructor(private readonly metricsRepository: MetricsRepository) {}

    async getMetrics(userId: string) {
        return this.metricsRepository.getMetrics(userId);
    }
}
