import { Controller, Get } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type User } from '@prisma/client';

import { GetUser } from 'src/auth/decorators';

import { ActivitiesService } from '../services';

@ApiTags('activities')
@ApiBearerAuth('access-token')
@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}

    @Get()
    @ApiOperation({
        summary: 'Get recent activities',
    })
    async getActivities(@GetUser() user: User) {
        return this.activitiesService.getActivities(user.id);
    }
}
