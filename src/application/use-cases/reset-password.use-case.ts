import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { IPasswordService } from '../interfaces/services';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ICacheService } from '../interfaces/cache.service';

@Injectable()
export class ResetPasswordUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IPasswordService') private readonly passwordService: IPasswordService,
        @Inject('ICacheService') private readonly cacheService: ICacheService,
    ) { }

    async execute(dto: ResetPasswordDto): Promise<void> {
        const email = await this.cacheService.get<string>(`reset_token:${dto.token}`);
        if (!email) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestException('Invalid user');
        }

        const newHash = await this.passwordService.hash(dto.newPassword);
        user.passwordHash = newHash;
        // Invalidate current sessions on password reset for security
        user.currentHashedRefreshToken = undefined;

        await this.userRepository.update(user);

        // Remove token from Redis to prevent re-use
        await this.cacheService.del(`reset_token:${dto.token}`);
    }
}
