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

export const LocationDetailsSchema = z.object({
  location_id: z.string().describe('Unique Tripadvisor location ID of the destination or POI'),
  name: z.string().describe('Name of the location.'),
  description: z.string().optional().describe('Description of the location.'),
  web_url: z
    .string()
    .optional()
    .describe(
      'Link to the POI detail page on Tripadvisor. Link is localized to the correct domain if a language other than English is requested',
    ),
  address_obj: addressSchema,
  latitude: z.string().nullish().describe('The latitude of the location'),
  longitude: z.string().nullish().describe('The longitude of the location'),
  timezone: z.string().nullish().describe('The timezone of the location'),
  email: z.string().nullish().describe('The email of the location'),
  phone: z.string().nullish().describe('The phone number of the location'),
  website: z.string().nullish().describe('The website of the location'),
  write_review: z
    .string()
    .nullish()
    .describe(
      'Link to the review form for this specific POI on Tripadvisor. Link is localized to the correct domain if a language other than English is requested.',
    ),
  rating: z
    .number()
    .nullish()
    .describe(
      `
        Overall rating for this POI. Not applicable to geographic locations. Rating levels are defined as follows:
        5: Excellent
        4: Very good
        3: Average
        2: Poor
        1: Terrible
      `,
    ),
  rating_image_url: z
    .string()
    .nullish()
    .describe(
      'URL to the bubble rating image for this location. Overall Bubble Ratings must be displayed using the Tripadvisor bubble rating image with the owl icon.',
    ),
});

export const LocationPhotosSchema = z
  .object({
    data: z
      .array(
        z.object({
          id: z.number().describe('Unique identifier for the photo.'),
          url: z.string().describe('URL of the photo.'),
          caption: z.string().optional().describe('Caption for the photo.'),
          // Add other fields as necessary
        }),
      )
      .describe('List of photos for the location.'),
  })
  .describe('Photos of a specific location.');

export const LocationReviewsSchema = z
  .object({
    data: z
      .array(
        z.object({
          id: z.number().describe('Unique identifier for the review.'),
          text: z.string().describe('Text content of the review.'),
          rating: z.number().describe('Rating given in the review.'),
          // Add other fields as necessary
        }),
      )
      .describe('List of reviews for the location.'),
  })
  .describe('Reviews of a specific location.');

export const SearchResultsSchema = z
  .object({
    data: z
      .array(
        z.object({
          location_id: z.string().describe('Unique identifier for the location.'),
          name: z.string().describe('Name of the location.'),
          distance: z.string().describe('Distance, in miles, this location is from the passed in LatLong parameters.'),
          bearing: z.string().describe('Bearing, in degrees, this location is from the passed in LatLong parameters.'),
          address_obj: addressSchema,
        }),
      )
      .describe('List of locations matching the search query.'),
  })
  .describe('Results of a location search query.');

//////////////////////
///// EXPORTS //////
////////////////////
export type SearchLocationsParams = z.infer<typeof SearchLocationsParamsSchema>;
export type LocationDetailsParams = z.infer<typeof LocationDetailsParamsSchema>;
export type LocationPhotosParams = z.infer<typeof LocationPhotosParamsSchema>;
export type LocationReviewsParams = z.infer<typeof LocationReviewsParamsSchema>;

export type LocationDetails = z.infer<typeof LocationDetailsSchema>;
export type LocationPhotos = z.infer<typeof LocationPhotosSchema>;
export type LocationReviews = z.infer<typeof LocationReviewsSchema>;
export type SearchResults = z.infer<typeof SearchResultsSchema>;
