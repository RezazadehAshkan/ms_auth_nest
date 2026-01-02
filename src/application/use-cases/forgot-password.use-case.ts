import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ICacheService } from '../interfaces/cache.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ForgotPasswordUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('ICacheService') private readonly cacheService: ICacheService,
    ) { }

    async execute(dto: ForgotPasswordDto): Promise<void> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            // We return success to prevent user enumeration
            return;
        }

        const token = uuidv4();
        // Store token in Redis with email, expire in 15 minutes (900 seconds)
        // Key: reset_token:<token> -> Value: <email>
        await this.cacheService.set(`reset_token:${token}`, user.email, 900);

        // In a real app, send email here. 
        // For now, log it clearly so user can see it in console.
        console.log(`[ForgotPassword] Password reset requested for ${user.email}. Token: ${token}`);
    }
}
