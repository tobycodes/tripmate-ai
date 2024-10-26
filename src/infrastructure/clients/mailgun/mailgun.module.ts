import { Global, Module, Provider } from '@nestjs/common';
import { MailgunClient } from './mailgun.client';
import { mailgunConfigSchema } from './mailgun.schemas';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

const MailgunClientProvider: Provider = {
  provide: MailgunClient,
  useFactory: (logger: LoggerAdapter) => {
    const config = mailgunConfigSchema.parse({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      username: process.env.MAILGUN_USERNAME,
      defaultFrom: process.env.MAILGUN_DEFAULT_FROM,
    });

    return new MailgunClient(config, logger);
  },
  inject: [LoggerAdapter],
};

@Global()
@Module({
  providers: [MailgunClientProvider],
  exports: [MailgunClient],
})
export class MailgunModule {}
