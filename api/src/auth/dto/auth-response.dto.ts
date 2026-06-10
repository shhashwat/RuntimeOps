import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
