import { Controller, Get, Param, Post } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type User } from '@prisma/client';

import { GetUser } from 'src/auth/decorators';

import { DeploymentsService } from '../services';

@ApiTags('deployments')
@ApiBearerAuth('access-token')
@Controller('deployments')
export class DeploymentsController {
    constructor(private readonly deploymentsService: DeploymentsService) {}

    @Post(':projectId')
    @ApiOperation({
        summary: 'Trigger deployment',
    })
    async createDeployment(
        @GetUser() user: User,

        @Param('projectId')
        projectId: string,
    ) {
        return this.deploymentsService.createDeployment(user.id, projectId);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all deployments',
    })
    async getDeployments(@GetUser() user: User) {
        return this.deploymentsService.getDeployments(user.id);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get deployment by id',
    })
    async getDeploymentById(
        @GetUser() user: User,

        @Param('id')
        deploymentId: string,
    ) {
        return this.deploymentsService.getDeploymentById(user.id, deploymentId);
    }

    @Get(':id/logs')
    @ApiOperation({
        summary: 'Get deployment logs',
    })
    async getDeploymentLogs(
        @GetUser() user: User,

        @Param('id')
        deploymentId: string,
    ) {
        return this.deploymentsService.getDeploymentLogs(user.id, deploymentId);
    }
}
