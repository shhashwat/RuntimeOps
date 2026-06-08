import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
    controllers: [AppController],
    imports: [DatabaseModule, AuthModule, UsersModule],
})
export class AppModule {}
