import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { IPasswordService, ITokenService } from '../interfaces/services';
import { ICacheService } from '../interfaces/cache.service';
import { LoginUserDto } from '../dtos/login-user.dto';

@Injectable()
export class LoginUserUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IPasswordService') private readonly passwordService: IPasswordService,
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('ICacheService') private readonly cacheService: ICacheService,
    ) { }

    async execute(dto: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await this.passwordService.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = this.tokenService.generateToken(payload);
        const refreshToken = this.tokenService.generateRefreshToken(payload);

        // Improved Performance: Store hashed refresh token in Cache (Redis)
        // Key: refresh_token:<userId> -> Value: <hashedToken>
        const hashedRefreshToken = await this.passwordService.hash(refreshToken);
        await this.cacheService.set(`refresh_token:${user.id}`, hashedRefreshToken, 604800); // 7 days

        return { accessToken, refreshToken };
    }
}
