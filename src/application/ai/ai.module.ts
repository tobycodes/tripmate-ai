import { Global, Module } from '@nestjs/common';
import { TripAdvisorService } from 'src/infrastructure/clients/trip_advisor';
import { AiService } from './ai.service';
import { configSchema } from './ai.schemas';
import { ConfigAdapter } from 'src/infrastructure/config/config.adapter';
import { DbConfigType } from 'src/infrastructure/config/config.register';

function buildPgUrl({ user, password, host, port, database }: DbConfigType) {
  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

const AiServiceProvider = {
  provide: AiService,
  useFactory: async (tripAdvisorService: TripAdvisorService, configAdapter: ConfigAdapter) => {
    const dbConfig = configAdapter.get('db');
    const postgresUrl = buildPgUrl(dbConfig);

    const config = configSchema.parse({
      openAiApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL_NAME,
      postgresUrl,
    });

    return AiService.init({ config, tripAdvisorService });
  },
  inject: [TripAdvisorService, ConfigAdapter],
};

@Global()
@Module({
  providers: [AiServiceProvider],
  exports: [AiService],
})
export class AIModule {}
