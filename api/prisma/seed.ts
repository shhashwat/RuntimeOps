import {
    ActivityType,
    DeploymentStatus,
    DeploymentStrategy,
    Environment,
    LogLevel,
    PrismaClient,
    Role,
} from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding RuntimeOps...');

    await prisma.activity.deleteMany();
    await prisma.deploymentLog.deleteMany();
    await prisma.deployment.deleteMany();
    await prisma.project.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash('Test123!', 10);

    const users = await prisma.user.createManyAndReturn({
        data: [
            {
                name: 'Dev User One',

                email: 'dev1@email.com',

                passwordHash: password,

                role: Role.DEVELOPER,
            },

            {
                name: 'Dev User Two',

                email: 'dev2@email.com',

                passwordHash: password,

                role: Role.DEVELOPER,
            },

            {
                name: 'Runtime Admin',

                email: 'admin@runtime.ops',

                passwordHash: password,

                role: Role.ADMIN,
            },
        ],
    });

    const [dev1, dev2, admin] = users;

    const deploymentLogs = [
        'Pulling repository...',
        'Installing dependencies...',
        'Running production build...',
        'Provisioning infrastructure...',
        'Deploying services...',
        'Running health checks...',
        'Deployment completed successfully.',
    ];

    const projectTemplates = [
        {
            name: 'RuntimeOps API',
            slug: 'runtimeops-api',
            repoUrl: 'https://github.com/runtimeops/api',
        },

        {
            name: 'RuntimeOps Dashboard',

            slug: 'runtimeops-dashboard',

            repoUrl: 'https://github.com/runtimeops/dashboard',
        },

        {
            name: 'RuntimeOps Worker',

            slug: 'runtimeops-worker',

            repoUrl: 'https://github.com/runtimeops/worker',
        },
    ];

    const allUsers = [dev1, dev2, admin];

    for (const user of allUsers) {
        for (let i = 0; i < projectTemplates.length; i++) {
            const template = projectTemplates[i];

            const project = await prisma.project.create({
                data: {
                    name: `${template.name} ${user.name}`,

                    slug: `${template.slug}-${user.id.slice(0, 6)}`,

                    repoUrl: template.repoUrl,

                    environment:
                        i % 2 === 0
                            ? Environment.PRODUCTION
                            : Environment.STAGING,

                    deploymentStrategy:
                        i % 2 === 0
                            ? DeploymentStrategy.QUEUED
                            : DeploymentStrategy.MANUAL,

                    createdById: user.id,
                },
            });

            const deployment = await prisma.deployment.create({
                data: {
                    projectId: project.id,

                    triggeredById: user.id,

                    targetEnvironment: project.environment,

                    status: DeploymentStatus.SUCCESS,

                    startedAt: new Date(Date.now() - 1000 * 60 * 10),

                    completedAt: new Date(Date.now() - 1000 * 60 * 8),
                },
            });

            for (let j = 0; j < deploymentLogs.length; j++) {
                await prisma.deploymentLog.create({
                    data: {
                        deploymentId: deployment.id,

                        sequence: j + 1,

                        level: LogLevel.INFO,

                        message: deploymentLogs[j],
                    },
                });
            }

            await prisma.activity.createMany({
                data: [
                    {
                        userId: user.id,

                        type: ActivityType.PROJECT_CREATED,

                        message: `Project "${project.name}" created`,

                        projectId: project.id,
                    },

                    {
                        userId: user.id,

                        type: ActivityType.DEPLOYMENT_TRIGGERED,

                        message: `Deployment triggered for ${project.name}`,

                        projectId: project.id,

                        deploymentId: deployment.id,
                    },

                    {
                        userId: user.id,

                        type: ActivityType.DEPLOYMENT_STATUS_CHANGED,

                        message: `Deployment started for ${project.name}`,

                        projectId: project.id,

                        deploymentId: deployment.id,
                    },

                    {
                        userId: user.id,

                        type: ActivityType.DEPLOYMENT_SUCCEEDED,

                        message: `Deployment successful for ${project.name}`,

                        projectId: project.id,

                        deploymentId: deployment.id,
                    },
                ],
            });
        }
    }

    console.log('✅ RuntimeOps seed completed');

    console.log(`
Accounts:

ADMIN
email: admin@runtime.ops
password: Test123!

DEVELOPER
email: dev1@email.com
password: Test123!

DEVELOPER
email: dev2@email.com
password: Test123!
    `);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
