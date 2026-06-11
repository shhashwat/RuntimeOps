import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { type User } from '@prisma/client';

import { Public, GetUser } from '../decorators';

import {
    AuthResponseDto,
    LoginDto,
    RefreshTokenDto,
    RegisterDto,
    UpdateProfileDto,
} from '../dto';

import { AuthService } from '../services';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new user',
    })
    @ApiResponse({
        status: 201,
        type: AuthResponseDto,
    })
    async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(dto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Login user',
    })
    @ApiResponse({
        status: 200,
        type: AuthResponseDto,
    })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(dto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refresh access token',
    })
    @ApiResponse({
        status: 200,
        type: AuthResponseDto,
    })
    async refresh(
        @Body()
        dto: RefreshTokenDto,
    ) {
        return this.authService.refreshTokens(dto.userId, dto.refreshToken);
    }

    @Delete('logout')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Logout user',
    })
    async logout(@GetUser() user: User) {
        return this.authService.logout(user.id);
    }

    @Get('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get currently authenticated user',
    })
    async me(@GetUser() user: User) {
        return user;
    }

    @Patch('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Update current user profile',
    })
    async updateProfile(@GetUser() user: User, @Body() dto: UpdateProfileDto) {
        return this.authService.updateProfile(user.id, dto);
    }
}
