import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    newPassword: string;
}
