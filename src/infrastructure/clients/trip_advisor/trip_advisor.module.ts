import axios from 'axios';
import { Global, Module } from '@nestjs/common';
import { TripAdvisorService } from './trip_advisor.service';
import { configSchema } from './trip_advisor.schemas';

const TripAdvisorServiceProvider = {
  provide: TripAdvisorService,
  useFactory: () => {
    const config = configSchema.parse({
      apiKey: process.env.TRIP_ADVISOR_API_KEY,
      baseUrl: process.env.TRIP_ADVISOR_BASE_URL,
    });
    const httpClient = axios.create({ baseURL: config.baseUrl });

    return new TripAdvisorService(httpClient, config);
  },
};

@Global()
@Module({
  providers: [TripAdvisorServiceProvider],
  exports: [TripAdvisorService],
})
export class TripAdvisorModule {}
