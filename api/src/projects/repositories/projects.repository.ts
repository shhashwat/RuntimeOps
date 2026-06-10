import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

import { CreateProjectDto, UpdateProjectDto } from '../dto';

@Injectable()
export class ProjectsRepository {
    constructor(private readonly db: DatabaseService) {}

    async createProject(userId: string, dto: CreateProjectDto) {
        const baseSlug = dto.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');

        const existingProject = await this.db.project.findFirst({
            where: {
                slug: {
                    startsWith: baseSlug,
                },
            },
            select: {
                id: true,
            },
        });

        const slug = existingProject ? `${baseSlug}-${Date.now()}` : baseSlug;
        return this.db.project.create({
            data: {
                ...dto,
                slug,
                createdById: userId,
            },
        });
    }

    async getProjects(userId: string) {
        return this.db.project.findMany({
            where: {
                createdById: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getProjectById(userId: string, projectId: string) {
        const project = await this.db.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (project.createdById !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return project;
    }

    async updateProject(
        userId: string,
        projectId: string,
        dto: UpdateProjectDto,
    ) {
        await this.getProjectById(userId, projectId);

        return this.db.project.update({
            where: {
                id: projectId,
            },
            data: dto,
        });
    }

    async deleteProject(userId: string, projectId: string) {
        await this.getProjectById(userId, projectId);

        return this.db.project.delete({
            where: {
                id: projectId,
            },
        });
    }
}
