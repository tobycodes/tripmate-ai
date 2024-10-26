import axios from 'axios';
import { Global, Module } from '@nestjs/common';
import { TripAdvisorClient } from './trip_advisor.client';
import { configSchema } from './trip_advisor.schemas';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

const TripAdvisorClientProvider = {
  provide: TripAdvisorClient,
  useFactory: (logger: LoggerAdapter) => {
    const config = configSchema.parse({
      apiKey: process.env.TRIP_ADVISOR_API_KEY,
      baseUrl: process.env.TRIP_ADVISOR_BASE_URL,
    });
    const httpClient = axios.create({ baseURL: config.baseUrl });

    return new TripAdvisorClient(httpClient, config, logger);
  },
  inject: [LoggerAdapter],
};

@Global()
@Module({
  providers: [TripAdvisorClientProvider],
  exports: [TripAdvisorClient],
})
export class TripAdvisorModule {}
