import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosResponse } from 'axios';
import { SearchLocationsParams, Config, SearchLocationsParamsSchema } from './trip_advisor.schemas';
import { ExternalApiError } from 'src/kernel/errors';
import { LoggerAdapter } from 'src/infrastructure/logger/logger.adapter';

@Injectable()
export class TripAdvisorClient {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly config: Config,
    private readonly logger: LoggerAdapter,
  ) {}

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.httpClient.get(endpoint, {
        params: { ...params, key: this.config.apiKey },
      });
      return response.data;
    } catch (error) {
      this.logger.error(error, `TripAdvisor API error: ${error.response.data.message}`);
      throw new ExternalApiError('TripAdvisor API error', { httpCode: error.response.status }, error);
    }
  }

  /**
   * Search for locations on TripAdvisor based on the provided parameters.
   * @param {SearchLocationsParams} params - The search parameters.
   * @returns {Promise<any>} A promise that resolves to the search results.
   * @throws {ExternalApiError} If there's an error with the API request.
   */
  async searchLocations(params: SearchLocationsParams): Promise<any> {
    SearchLocationsParamsSchema.parse(params);
    const data = await this.makeRequest<any>('/location/search', params);
    return data;
  }

  /**
   * Get details for a specific location on TripAdvisor.
   * @param {number} locationId - The unique identifier for the location.
   * @returns {Promise<LocationDetails>} A promise that resolves to the location details.
   * @throws {ExternalApiError} If there's an error with the API request.
   */
  async getLocationDetails(locationId: number): Promise<any> {
    const data = await this.makeRequest<any>(`/location/${locationId}/details`);
    return data;
  }

  /**
   * Get photos for a specific location on TripAdvisor.
   * @param {number} locationId - The unique identifier for the location.
   * @returns {Promise<LocationPhotos>} A promise that resolves to the location photos.
   * @throws {ExternalApiError} If there's an error with the API request.
   */
  async getLocationPhotos(locationId: number): Promise<any> {
    const data = await this.makeRequest<any>(`/location/${locationId}/photos`);
    return data;
  }

  /**
   * Get reviews for a specific location on TripAdvisor.
   * @param {number} locationId - The unique identifier for the location.
   * @returns {Promise<LocationReviews>} A promise that resolves to the location reviews.
   * @throws {ExternalApiError} If there's an error with the API request.
   */
  async getLocationReviews(locationId: number): Promise<any> {
    const data = await this.makeRequest<any>(`/location/${locationId}/reviews`);
    return data;
  }
}
