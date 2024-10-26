import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { TripAdvisorClient } from 'src/infrastructure/clients/trip_advisor/trip_advisor.client';
import {
  SearchLocationsParamsSchema,
  LocationDetailsParamsSchema,
  LocationPhotosParamsSchema,
  LocationReviewsParamsSchema,
} from 'src/infrastructure/clients/trip_advisor/trip_advisor.schemas';

class TripAdvisorSearchLocationsTool extends StructuredTool {
  name = 'trip_advisor_search_locations';
  description = 'Search for locations using TripAdvisor';
  schema = z.object({
    params: SearchLocationsParamsSchema,
  });

  constructor(private readonly tripAdvisorClient: TripAdvisorClient) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<any> {
    return await this.tripAdvisorClient.searchLocations(input.params);
  }
}

class TripAdvisorGetLocationDetailsTool extends StructuredTool {
  name = 'trip_advisor_get_location_details';
  description = 'Get details for a specific location on TripAdvisor';
  schema = LocationDetailsParamsSchema;

  constructor(private readonly tripAdvisorClient: TripAdvisorClient) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<any> {
    return await this.tripAdvisorClient.getLocationDetails(input.locationId);
  }
}

class TripAdvisorGetLocationPhotosTool extends StructuredTool {
  name = 'trip_advisor_get_location_photos';
  description = 'Get photos for a specific location on TripAdvisor';
  schema = LocationPhotosParamsSchema;

  constructor(private readonly tripAdvisorClient: TripAdvisorClient) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<any> {
    return await this.tripAdvisorClient.getLocationPhotos(input.locationId);
  }
}

class TripAdvisorGetLocationReviewsTool extends StructuredTool {
  name = 'trip_advisor_get_location_reviews';
  description = 'Get reviews for a specific location on TripAdvisor';
  schema = LocationReviewsParamsSchema;

  constructor(private readonly tripAdvisorClient: TripAdvisorClient) {
    super();
  }

  async _call(input: z.infer<typeof this.schema>): Promise<any> {
    return await this.tripAdvisorClient.getLocationReviews(input.locationId);
  }
}

export const initTripAdvisorTools = (tripAdvisorClient: TripAdvisorClient) => {
  return [
    new TripAdvisorSearchLocationsTool(tripAdvisorClient),
    new TripAdvisorGetLocationDetailsTool(tripAdvisorClient),
    new TripAdvisorGetLocationPhotosTool(tripAdvisorClient),
    new TripAdvisorGetLocationReviewsTool(tripAdvisorClient),
  ];
};
