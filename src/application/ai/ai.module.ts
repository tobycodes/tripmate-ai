import { Global, Module } from '@nestjs/common';
import { TripAdvisorService } from 'src/infrastructure/clients/trip_advisor';
import { AiService } from './ai.service';
import { configSchema } from './ai.schemas';

const AiServiceProvider = {
  provide: AiService,
  useFactory: (tripAdvisorService: TripAdvisorService) => {
    const config = configSchema.parse({
      openAiApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL_NAME,
    });

    return new AiService(config, tripAdvisorService);
  },
  inject: [TripAdvisorService],
};

@Global()
@Module({
  providers: [AiServiceProvider],
  exports: [AiService],
})
export class AIModule {}
