import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AccessModule } from './application/access/access.module';
import { AIModule } from './application/ai/ai.module';
import { AppController } from './app.controller';
import { AuthModule } from './application/auth/auth.module';
import { ChatModule } from './application/chat/chat.module';
import { ConfigModule } from './infrastructure/config/config.module';
import { ConfigAdapter } from './infrastructure/config/config.adapter';
import { DatabaseModule } from './infrastructure/database/database.module';
import { InterfaceModule } from './interface/interface.module';
import { TripAdvisorModule } from './infrastructure/clients/trip_advisor/trip_advisor.module';
import { UserModule } from './application/user/user.module';
import { CryptoModule } from './infrastructure/crypto/crypto.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { MailgunModule } from './infrastructure/clients/mailgun/mailgun.module';
import { EventModule } from './infrastructure/events/event.module';

const appModules = [
  ConfigModule,
  CryptoModule,
  LoggerModule,
  EventModule,
  TripAdvisorModule,
  MailgunModule,
  DatabaseModule,
  AIModule,
  UserModule,
  AuthModule,
  AccessModule,
  ChatModule,
];

const nestModules = [
  JwtModule.registerAsync({
    useFactory: (config: ConfigAdapter) => ({
      secret: config.get('app.jwtSecret'),
      signOptions: { expiresIn: '1d' },
    }),
    inject: [ConfigAdapter],
    global: true,
  }),
];

@Module({
  imports: [...appModules, ...nestModules, InterfaceModule],
  controllers: [AppController],
})
export class AppModule {}
