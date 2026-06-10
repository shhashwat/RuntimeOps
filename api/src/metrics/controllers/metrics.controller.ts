import { Controller, Get } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type User } from '@prisma/client';

import { GetUser } from 'src/auth/decorators';

import { MetricsService } from '../services';

@ApiTags('metrics')
@ApiBearerAuth('access-token')
@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) {}

    @Get()
    @ApiOperation({
        summary: 'Get deployment metrics',
    })
    async getMetrics(@GetUser() user: User) {
        return this.metricsService.getMetrics(user.id);
    }
}
