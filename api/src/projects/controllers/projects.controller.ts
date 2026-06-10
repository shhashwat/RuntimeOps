import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type User } from '@prisma/client';

import { GetUser } from 'src/auth/decorators';

import { CreateProjectDto, UpdateProjectDto } from '../dto';

import { ProjectsService } from '../services';
import { JwtAuthGuard } from 'src/auth/guards';

@ApiTags('projects')
@ApiBearerAuth('access-token')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    @ApiOperation({
        summary: 'Create project',
    })
    async createProject(
        @GetUser() user: User,
        @Body(ValidationPipe) dto: CreateProjectDto,
    ) {
        return this.projectsService.createProject(user.id, dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all projects',
    })
    async getProjects(@GetUser() user: User) {
        return this.projectsService.getProjects(user.id);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get project by id',
    })
    async getProjectById(
        @GetUser() user: User,

        @Param('id')
        projectId: string,
    ) {
        return this.projectsService.getProjectById(user.id, projectId);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update project',
    })
    async updateProject(
        @GetUser() user: User,

        @Param('id')
        projectId: string,

        @Body()
        dto: UpdateProjectDto,
    ) {
        return this.projectsService.updateProject(user.id, projectId, dto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete project',
    })
    async deleteProject(
        @GetUser() user: User,

        @Param('id')
        projectId: string,
    ) {
        return this.projectsService.deleteProject(user.id, projectId);
    }
}
