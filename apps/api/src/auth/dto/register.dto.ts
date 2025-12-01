import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(1)
    @MaxLength(32)
    @IsNotEmpty()
    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',
    })
    name: string;

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