import { Module } from '@nestjs/common';
import { ProjectsService } from './services';
import { ProjectsController } from './controllers';
import { ProjectsRepository } from './repositories';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
    imports: [ActivitiesModule],
    controllers: [ProjectsController],
    providers: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
