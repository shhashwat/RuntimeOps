import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { QueueModule } from './queue/queue.module';
import { ActivitiesModule } from './activities/activities.module';
import { MetricsModule } from './metrics/metrics.module';
import { BullModule } from '@nestjs/bullmq';
import { DEPLOYMENT_QUEUE } from './queue/constants';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        BullModule.registerQueue({
            name: DEPLOYMENT_QUEUE,
        }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        ProjectsModule,
        DeploymentsModule,
        QueueModule,
        ActivitiesModule,
        MetricsModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
