import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterUserDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password: string;
}
