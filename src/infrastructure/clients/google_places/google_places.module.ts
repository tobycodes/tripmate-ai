import { Global, Module, Provider } from '@nestjs/common';
import axios from 'axios';
import { GooglePlacesClient } from './google_places.client';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';
import { configSchema } from './google_places.schemas';

const GooglePlacesClientProvider: Provider = {
  provide: GooglePlacesClient,
  useFactory: (logger: LoggerAdapter) => {
    const config = configSchema.parse({
      apiKey: process.env.GOOGLE_PLACES_API_KEY,
    });

    return new GooglePlacesClient(config, axios.create(), logger);
  },
  inject: [LoggerAdapter],
};

@Global()
@Module({
  providers: [GooglePlacesClientProvider],
  exports: [GooglePlacesClientProvider],
})
export class GooglePlacesModule {}
