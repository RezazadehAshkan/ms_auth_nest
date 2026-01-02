import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../application/interfaces/services';

@Injectable()
export class JwtTokenService implements ITokenService {
    constructor(private readonly jwtService: JwtService) { }

    generateToken(payload: any): string {
        return this.jwtService.sign(payload);
    }

    generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME as any,
        });
    }

    verifyToken(token: string): any {
        return this.jwtService.verify(token);
    }

    verifyRefreshToken(token: string): any {
        return this.jwtService.verify(token, {
            secret: process.env.JWT_REFRESH_SECRET,
        });
    }
}
