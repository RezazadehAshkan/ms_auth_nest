export interface IPasswordService {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}

export interface ITokenService {
    generateToken(payload: any): string;
    generateRefreshToken(payload: any): string;
    verifyToken(token: string): any;
    verifyRefreshToken(token: string): any;
}
