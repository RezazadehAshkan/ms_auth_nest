import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WinstonModule, utilities as nestWinstonUtilities } from 'nest-winston';
import * as winston from 'winston';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RefreshUserTokenUseCase } from './application/use-cases/refresh-user-token.use-case';
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case';
import { ForgotPasswordUseCase } from './application/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { BcryptService } from './infrastructure/auth/bcrypt.service';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service';
import { UserOrmEntity } from './infrastructure/database/entities/user.orm-entity';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { CacheInfrastructureModule } from './infrastructure/caching/cache-infrastructure.module';

import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './presentation/controllers/health.controller';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';

// ...

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonUtilities.format.nestLike('AuthService', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonUtilities.format.nestLike('AuthService', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    CacheInfrastructureModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [UserOrmEntity],
        // Synchronize should be FALSE in production
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController, HealthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshUserTokenUseCase,
    LogoutUserUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'IPasswordService',
      useClass: BcryptService,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
  ],
})
export class AppModule { }
