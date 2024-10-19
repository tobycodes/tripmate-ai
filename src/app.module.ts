import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccessModule } from './application/access/access.module';
import { AIModule } from './application/ai/ai.module';
import { AppController } from './app.controller';
import { AuthModule } from './application/auth/auth.module';
import { ChatModule } from './application/chat/chat.module';
import { ConfigModule } from './infrastructure/config/config.module';
import { ConfigService } from './infrastructure/config/config.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { InterfaceModule } from './interface/interface.module';
import { TripAdvisorModule } from './infrastructure/clients/trip_advisor/trip_advisor.module';
import { UserModule } from './application/user/user.module';
import { CryptoModule } from './infrastructure/crypto/crypto.module';
import { LoggerModule } from './infrastructure/logger/logger.module';

const appModules = [
  ConfigModule,
  CryptoModule,
  LoggerModule,
  TripAdvisorModule,
  AIModule,
  ChatModule,
  DatabaseModule,
  UserModule,
  AccessModule,
  AuthModule,
];

const nestModules = [
  JwtModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      secret: config.get('app.jwtSecret'),
      signOptions: { expiresIn: '1d' },
    }),
    inject: [ConfigService],
    global: true,
  }),
];

@Module({
  imports: [...appModules, ...nestModules, InterfaceModule],
  controllers: [AppController],
})
export class AppModule {}
