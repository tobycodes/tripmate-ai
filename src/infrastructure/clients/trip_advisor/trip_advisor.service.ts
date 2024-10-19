import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosInstance, AxiosResponse } from 'axios';
import {
  SearchLocationsParams,
  LocationDetails,
  LocationPhotos,
  LocationReviews,
  SearchResults,
  Config,
  SearchLocationsParamsSchema,
  LocationDetailsSchema,
  LocationPhotosSchema,
  LocationReviewsSchema,
  SearchResultsSchema,
} from './trip_advisor.schemas';

@Injectable()
export class TripAdvisorService {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly config: Config,
  ) {}

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.httpClient.get(endpoint, {
        params: { ...params, key: this.config.apiKey },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(`TripAdvisor API error: ${error.response.data.message}`, error.response.status);
      } else {
        throw new HttpException(
          'An unexpected error occurred while communicating with the TripAdvisor API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Search for locations on TripAdvisor based on the provided parameters.
   * @param {SearchLocationsParams} params - The search parameters.
   * @returns {Promise<SearchResults>} A promise that resolves to the search results.
   * @throws {HttpException} If there's an error with the API request.
   */
  async searchLocations(params: SearchLocationsParams): Promise<SearchResults> {
    SearchLocationsParamsSchema.parse(params); // Validate request params
    const data = await this.makeRequest<SearchResults>('/location/search', params);
    console.dir(data, { depth: null });
    return SearchResultsSchema.parse(data); // Validate response
  }

  /**
   * Get details for a specific location on TripAdvisor.
   * @param {number} locationId - The unique identifier for the location.
   * @returns {Promise<LocationDetails>} A promise that resolves to the location details.
   * @throws {HttpException} If there's an error with the API request.
   */
  async getLocationDetails(locationId: number): Promise<LocationDetails> {
    const data = await this.makeRequest<LocationDetails>(`/location/${locationId}/details`);
    return LocationDetailsSchema.parse(data); // Validate response
  }

  /**
   * Get photos for a specific location on TripAdvisor.
   * @param {number} locationId - The unique identifier for the location.
   * @returns {Promise<LocationPhotos>} A promise that resolves to the location photos.
   * @throws {HttpException} If there's an error with the API request.
   */
  async getLocationPhotos(locationId: number): Promise<LocationPhotos> {
    const data = await this.makeRequest<LocationPhotos>(`/location/${locationId}/photos`);
    return LocationPhotosSchema.parse(data); // Validate response
  }

  /**
   * Get reviews for a specific location on TripAdvisor.
   * @param {number} locationId - The unique identifier for the location.
   * @returns {Promise<LocationReviews>} A promise that resolves to the location reviews.
   * @throws {HttpException} If there's an error with the API request.
   */
  async getLocationReviews(locationId: number): Promise<LocationReviews> {
    const data = await this.makeRequest<LocationReviews>(`/location/${locationId}/reviews`);
    return LocationReviewsSchema.parse(data); // Validate response
  }
}
