import { z } from 'zod';

export const configSchema = z.object({
  apiKey: z.string().describe('API key for Google Places API.'),
});

export type ConfigType = z.infer<typeof configSchema>;

export const SearchPlacesParamsSchema = z
  .object({ query: z.string().describe('The text used for searching based on the name of the location.') })
  .describe('Parameters for searching locations on Google Places.');

export type SearchPlacesParams = z.infer<typeof SearchPlacesParamsSchema>;
