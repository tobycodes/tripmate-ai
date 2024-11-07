import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { GooglePlacesClient } from 'src/infrastructure/clients/google_places/google_places.client';
import { SearchPlacesParamsSchema } from 'src/infrastructure/clients/google_places/google_places.schemas';

export class GooglePlacesSearchTool extends StructuredTool {
  name = 'google_places_search';
  description = 'Search for locations using Google Places';

  schema = SearchPlacesParamsSchema;

  constructor(private readonly client: GooglePlacesClient) {
    super();
  }

  protected _call(input: z.infer<typeof this.schema>): Promise<any> {
    return this.client.search(input.query);
  }
}

export const initGooglePlacesTools = (client: GooglePlacesClient) => {
  return [new GooglePlacesSearchTool(client)];
};
