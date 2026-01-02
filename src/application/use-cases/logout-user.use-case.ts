import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ITokenService } from '../interfaces/services';

import { ICacheService } from '../interfaces/cache.service';

@Injectable()
export class LogoutUserUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('ICacheService') private readonly cacheService: ICacheService,
    ) { }

    async execute(dto: RefreshTokenDto): Promise<void> {
        try {
            // We verify just to extract the ID, even if expired it might be worth 
            // clearing the DB if we can parse it, but for now strict verify.
            const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
            // Invalidate session by removing token from Cache
            await this.cacheService.del(`refresh_token:${payload.sub}`);
        } catch (e) {
            // If token is invalid/expired, session is effectively dead anyway.
            // We suppress error to not leak info or block client logout.
        }
    }
}
