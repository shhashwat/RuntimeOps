import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
    constructor(private readonly db: DatabaseService) {}

    @Get()
    getHello(): string {
        return 'hello';
    }

    @Get('/health')
    async health() {
        await this.db.$queryRaw`SELECT 1`;

        return {
            status: 'ok',
            database: 'connected',
        };
    }
}
