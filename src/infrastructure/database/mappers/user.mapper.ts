import { User } from '../../../domain/entities/user';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
    static toDomain(ormEntity: UserOrmEntity): User {
        return new User(
            ormEntity.id,
            ormEntity.email,
            ormEntity.passwordHash,
            ormEntity.createdAt,
            ormEntity.updatedAt,
            ormEntity.currentHashedRefreshToken,
        );
    }

    static toOrm(domainEntity: User): UserOrmEntity {
        const ormEntity = new UserOrmEntity();
        ormEntity.id = domainEntity.id;
        ormEntity.email = domainEntity.email;
        ormEntity.passwordHash = domainEntity.passwordHash;
        ormEntity.currentHashedRefreshToken = domainEntity.currentHashedRefreshToken!;
        ormEntity.createdAt = domainEntity.createdAt;
        ormEntity.updatedAt = domainEntity.updatedAt;
        return ormEntity;
    }
}
