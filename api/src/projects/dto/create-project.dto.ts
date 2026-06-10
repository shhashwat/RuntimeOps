import { ApiProperty } from '@nestjs/swagger';

import { DeploymentStrategy, Environment } from '@prisma/client';

import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({
        example: 'RuntimeOps API',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'https://github.com/shashwat/runtimeops-api',
    })
    @IsUrl()
    repoUrl: string;

    @ApiProperty({
        enum: Environment,
    })
    @IsEnum(Environment)
    environment: Environment;

    @ApiProperty({
        enum: DeploymentStrategy,
    })
    @IsEnum(DeploymentStrategy)
    deploymentStrategy: DeploymentStrategy;
}
