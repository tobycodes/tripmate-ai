import { z } from 'zod';

export const configSchema = z.object({
  apiKey: z.string().describe('API key for TripAdvisor API.'),
  baseUrl: z.string().describe('Base URL for TripAdvisor API.'),
});

export type Config = z.infer<typeof configSchema>;

////////////////////////////
// REQUEST PARAM SCHEMAS //
//////////////////////////
export const SearchLocationsParamsSchema = z
  .object({
    searchQuery: z.string().describe('The text used for searching based on the name of the location.'),
    category: z
      .enum(['hotels', 'attractions', 'restaurants', 'geos'])
      .optional()
      .describe('Filters result set based on property type.'),
    phone: z.string().optional().describe('Phone number to filter the search results by.'),
    address: z.string().optional().describe('Address to filter the search results by.'),
    latLong: z
      .string()
      .optional()
      .describe('Latitude/Longitude pair to scope down the search around a specific point.'),
    radius: z
      .number()
      .optional()
      .describe('Length of the radius from the provided latitude/longitude pair to filter results.'),
    radiusUnit: z.enum(['km', 'mi', 'm']).optional().describe('Unit for length of the radius.'),
    page: z.number().optional().describe('Page number for paginated results.'),
    pageSize: z.number().optional().describe('Number of results per page for pagination.'),
  })
  .describe('Parameters for searching locations on TripAdvisor.');

const languageOptions = [
  'ar',
  'zh',
  'zh_TW',
  'da',
  'nl',
  'en_AU',
  'en_CA',
  'en_HK',
  'en_IN',
  'en_IE',
  'en_MY',
  'en_NZ',
  'en_PH',
  'en_SG',
  'en_ZA',
  'en_UK',
  'en',
  'fr',
  'fr_BE',
  'fr_CA',
  'fr_CH',
  'de_AT',
  'de',
  'el',
  'iw',
  'in',
  'it',
  'it_CH',
  'ja',
  'ko',
  'no',
  'pt_PT',
  'pt',
  'ru',
  'es_AR',
  'es_CO',
  'es_MX',
  'es_PE',
  'es',
  'es_VE',
  'es_CL',
  'sv',
  'th',
  'tr',
  'vi',
] as const;
export const LocationDetailsParamsSchema = z
  .object({
    locationId: z.number().describe('Unique identifier for the location.'),
    language: z.enum(languageOptions).optional().describe('Language of the location details to be returned.'),
    currency: z
      .string()
      .optional()
      .describe('Currency of the location details to be returned (ISO 4217 3-letter currency code).'),
  })
  .describe('Parameters for fetching details of a specific location.');

export const LocationPhotosParamsSchema = z
  .object({
    locationId: z.number().describe('Unique identifier for the location.'),
    page: z.number().optional().describe('Page number for paginated results.'),
    pageSize: z.number().optional().describe('Number of results per page for pagination.'),
  })
  .describe('Parameters for fetching photos of a specific location.');

export const LocationReviewsParamsSchema = z
  .object({
    locationId: z.number().describe('Unique identifier for the location.'),
    page: z.number().optional().describe('Page number for paginated results.'),
    pageSize: z.number().optional().describe('Number of results per page for pagination.'),
  })
  .describe('Parameters for fetching reviews of a specific location.');

//////////////////////////
//// RESPONSE SCHEMAS ////
//////////////////////////
const addressSchema = z.object({
  street1: z.string().describe('First line of the location address.'),
  street2: z.string().describe('Second line of the location address.').nullish(),
  city: z.string().describe('City of the location.'),
  state: z.string().describe('State of the location.'),
  country: z.string().describe('Country of the location.'),
  postalcode: z.string().describe('Postal code of the location.'),
  address_string: z.string().describe('The address in one single sentence.'),
});
const periodSchema = z.object({
  open: z
    .object({
      day: z.number().describe('The day of the week the period is open.'),
      time: z.string().describe('The time the period is open.'),
    })
    .describe('The day and times intervals in which the location is open'),
  close: z
    .object({
      day: z.number().describe('The day of the week the period is closed.'),
      time: z.string().describe('The time the period is closed.'),
    })
    .describe('The day and times intervals in which the location is closed'),
});

//////////////////////
///// EXPORTS //////
////////////////////
export type SearchLocationsParams = z.infer<typeof SearchLocationsParamsSchema>;
export type LocationDetailsParams = z.infer<typeof LocationDetailsParamsSchema>;
export type LocationPhotosParams = z.infer<typeof LocationPhotosParamsSchema>;
export type LocationReviewsParams = z.infer<typeof LocationReviewsParamsSchema>;
