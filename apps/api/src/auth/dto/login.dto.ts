import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'test@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the user (min 8 characters, max 32 characters)',
        example: '12345678',
    })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;
}