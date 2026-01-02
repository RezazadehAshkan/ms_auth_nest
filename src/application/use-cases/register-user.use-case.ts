import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { IPasswordService } from '../interfaces/services';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { User } from '../../domain/entities/user';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IPasswordService') private readonly passwordService: IPasswordService,
    ) { }

    async execute(dto: RegisterUserDto): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const passwordHash = await this.passwordService.hash(dto.password);

        // Simple ID generation for now, or let DB handle it. 
        // Ideally domain entities should have identity. 
        // We'll generate a UUID here.
        const id = uuidv4();
        const user = new User(id, dto.email, passwordHash, new Date(), new Date());

        return this.userRepository.create(user);
    }
}
