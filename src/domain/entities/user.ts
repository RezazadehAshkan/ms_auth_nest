export class User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    currentHashedRefreshToken?: string;

    constructor(id: string, email: string, passwordHash: string, createdAt: Date, updatedAt: Date, currentHashedRefreshToken?: string) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.currentHashedRefreshToken = currentHashedRefreshToken;
    }
}
