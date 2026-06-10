import { BadGatewayException, Injectable } from '@nestjs/common';

import { CreateProjectDto, UpdateProjectDto } from '../dto';

import { ProjectsRepository } from '../repositories';
import { ActivitiesService } from 'src/activities/services';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly projectsRepository: ProjectsRepository,
        private readonly activitiesService: ActivitiesService,
    ) {}

    async createProject(userId: string, dto: CreateProjectDto) {
        const res = await this.projectsRepository.createProject(userId, dto);
        if (!res) throw new BadGatewayException('Failed to create the project');
        await this.activitiesService.createActivity({
            userId,
            type: 'PROJECT_CREATED',
            message: `Project "${res.name}" created`,
        });
        return res;
    }

    async getProjects(userId: string) {
        return this.projectsRepository.getProjects(userId);
    }

    async getProjectById(userId: string, projectId: string) {
        return this.projectsRepository.getProjectById(userId, projectId);
    }

    async updateProject(
        userId: string,
        projectId: string,
        dto: UpdateProjectDto,
    ) {
        return this.projectsRepository.updateProject(userId, projectId, dto);
    }

    async deleteProject(userId: string, projectId: string) {
        return this.projectsRepository.deleteProject(userId, projectId);
    }
}
