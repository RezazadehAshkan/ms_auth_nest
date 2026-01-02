import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { IPasswordService, ITokenService } from '../interfaces/services';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

import { ICacheService } from '../interfaces/cache.service';

@Injectable()
export class RefreshUserTokenUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IPasswordService') private readonly passwordService: IPasswordService,
        @Inject('ICacheService') private readonly cacheService: ICacheService,
    ) { }

    async execute(dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
        let payload: any;
        try {
            payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.userRepository.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('Invalid request');
        }

        // Retrieve hashed token from Cache
        const currentHashedRefreshToken = await this.cacheService.get<string>(`refresh_token:${user.id}`);
        if (!currentHashedRefreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const isRefreshTokenMatching = await this.passwordService.compare(
            dto.refreshToken,
            currentHashedRefreshToken,
        );

        if (!isRefreshTokenMatching) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newPayload = { sub: user.id, email: user.email };
        const accessToken = this.tokenService.generateToken(newPayload);
        const refreshToken = this.tokenService.generateRefreshToken(newPayload);

        // Rotate token in Cache
        const hashedRefreshToken = await this.passwordService.hash(refreshToken);
        await this.cacheService.set(`refresh_token:${user.id}`, hashedRefreshToken, 604800); // 7 days

        return { accessToken, refreshToken };
    }
}
