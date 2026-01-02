import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user';
import { UserOrmEntity } from '../database/entities/user.orm-entity';
import { UserMapper } from '../database/mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repository: Repository<UserOrmEntity>,
    ) { }

    async create(user: User): Promise<User> {
        const ormEntity = UserMapper.toOrm(user);
        const saved = await this.repository.save(ormEntity);
        return UserMapper.toDomain(saved);
    }

    async findByEmail(email: string): Promise<User | null> {
        const found = await this.repository.findOne({ where: { email } });
        return found ? UserMapper.toDomain(found) : null;
    }

    async findById(id: string): Promise<User | null> {
        const found = await this.repository.findOne({ where: { id } });
        return found ? UserMapper.toDomain(found) : null;
    }

    async update(user: User): Promise<User> {
        const ormEntity = UserMapper.toOrm(user);
        const saved = await this.repository.save(ormEntity);
        return UserMapper.toDomain(saved);
    }
}
