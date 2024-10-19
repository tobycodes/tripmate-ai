import { StructuredTool } from '@langchain/core/tools';
import { TripAdvisorService } from 'src/infrastructure/clients/trip_advisor/trip_advisor.service';
import { z } from 'zod';
import {
  SearchResults,
  LocationDetails,
  LocationPhotos,
  LocationReviews,
  SearchLocationsParamsSchema,
  LocationDetailsParamsSchema,
  LocationPhotosParamsSchema,
  LocationReviewsParamsSchema,
} from '../../../infrastructure/clients/trip_advisor/trip_advisor.schemas';

class TripAdvisorSearchLocationsTool extends StructuredTool {
  name = 'trip_advisor_search_locations';
  description = 'Search for locations using TripAdvisor';
  schema = z.object({
    params: SearchLocationsParamsSchema,
  });

  constructor(private readonly tripAdvisorService: TripAdvisorService) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<SearchResults> {
    return await this.tripAdvisorService.searchLocations(input.params);
  }
}

class TripAdvisorGetLocationDetailsTool extends StructuredTool {
  name = 'trip_advisor_get_location_details';
  description = 'Get details for a specific location on TripAdvisor';
  schema = LocationDetailsParamsSchema;

  constructor(private readonly tripAdvisorService: TripAdvisorService) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<LocationDetails> {
    return await this.tripAdvisorService.getLocationDetails(input.locationId);
  }
}

class TripAdvisorGetLocationPhotosTool extends StructuredTool {
  name = 'trip_advisor_get_location_photos';
  description = 'Get photos for a specific location on TripAdvisor';
  schema = LocationPhotosParamsSchema;

  constructor(private readonly tripAdvisorService: TripAdvisorService) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<LocationPhotos> {
    return await this.tripAdvisorService.getLocationPhotos(input.locationId);
  }
}

class TripAdvisorGetLocationReviewsTool extends StructuredTool {
  name = 'trip_advisor_get_location_reviews';
  description = 'Get reviews for a specific location on TripAdvisor';
  schema = LocationReviewsParamsSchema;

  constructor(private readonly tripAdvisorService: TripAdvisorService) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<LocationReviews> {
    return await this.tripAdvisorService.getLocationReviews(input.locationId);
  }
}

export const initTripAdvisorTools = (tripAdvisorService: TripAdvisorService) => {
  return [
    new TripAdvisorSearchLocationsTool(tripAdvisorService),
    new TripAdvisorGetLocationDetailsTool(tripAdvisorService),
    new TripAdvisorGetLocationPhotosTool(tripAdvisorService),
    new TripAdvisorGetLocationReviewsTool(tripAdvisorService),
  ];
};
