import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';
import { ConfigType } from './google_places.schemas';
import { ExternalApiError } from 'src/kernel/errors';

@Injectable()
export class GooglePlacesClient {
  constructor(
    private readonly config: ConfigType,
    private readonly httpClient: AxiosInstance,
    private readonly logger: LoggerAdapter,
  ) {}

  async search(query: string): Promise<any> {
    try {
      const response = await this.httpClient.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          data: {
            textQuery: query,
            languageCode: 'en',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.config.apiKey,
            'X-Goog-FieldMask': '*',
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(error, 'Google Places API error');
      throw new ExternalApiError('Google Places API error', { httpCode: error.response.status }, error);
    }
  }
}
