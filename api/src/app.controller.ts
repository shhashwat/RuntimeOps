import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from './database/database.service';

@ApiTags('health')
@Controller()
export class AppController {
    constructor(private readonly db: DatabaseService) {}

    @Get('health')
    @ApiOperation({
        summary: 'Health check endpoint',
        description: 'Verifies that the RuntimeOps backend is running',
    })
    async healthCheck() {
        try {
            await this.db.$queryRaw`SELECT 1`;

            return {
                status: 'healthy',
                service: 'runtime-ops-api',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to connect to db, please make sure that the db is running',
            );
        }
    }
}
