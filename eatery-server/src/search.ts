import fetch from 'node-fetch';

interface Place {
  displayName: { text: string };
  formattedAddress: string;
  priceLevel?: number;
  editorialSummary?: { text: string };
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
}

interface ApiResponse {
  places: Place[];
  nextPageToken?: string;
  error?: any;
}

export const searchPlaces = async (coordinates : Number[], radius: Number, max_results : Number) => {
  const API_KEY = process.env.APIKEY
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY || 'FAIL',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.editorialSummary,places.websiteUri,places.rating,places.userRatingCount'
  };

  const data = {
  includedTypes: ["restaurant"],
  maxResultCount: 20, 
  locationRestriction:{
    "circle": {
      "center": {
        "latitude": coordinates[1], // 37.7937
        "longitude": coordinates[0]}, //-122.3965
      "radius": radius
    }
  }
  };

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json) 



    return json;
  } catch (error) {
    console.error(error);
    return "there was an error."
    //throw error;
  }
};
export const textSearchPlaces = async (
  query: string,
  coordinates: number[],
  radius: number,
  maxResults: number
): Promise<Place[]> => {
  const API_KEY = process.env.APIKEY || 'FAIL';
  const baseUrl = 'https://places.googleapis.com/v1/places:searchText';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.editorialSummary,places.websiteUri,places.rating,places.userRatingCount,nextPageToken'
  };

  let totalResults = 0;
  let pageToken: string | null = '';
  let results: Place[] = [];

  const makeRequest = async (pageToken: string | null): Promise<string | null> => {
    const data = {
      textQuery: query,
      pageSize: 20, // Fetch up to 20 results per request
      locationBias: {
        circle: {
          center: {
            latitude: coordinates[1],
            longitude: coordinates[0]
          },
          radius: radius
        }
      }
    } as {
      textQuery: string;
      pageSize: number;
      locationBias: {
        circle: {
          center: { latitude: number; longitude: number };
          radius: number;
        };
      };
      pageToken?: string;
    };

    // Include the nextPageToken if available
    if (pageToken) {
      data.pageToken = pageToken;
    }

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(baseUrl, options);
      
      // Explicitly cast the json response to `ApiResponse`
      const json = await response.json() as ApiResponse;

      // Error handling
      if (json.error) {
        console.error('API Error:', json.error);
        return null;
      }

      // Append results
      if (json.places) {
        results = results.concat(json.places);
        totalResults += json.places.length;
      }

      // Return the next page token if it exists
      return json.nextPageToken || null;
    } catch (error) {
      console.error('Error fetching places:', error);
      return null;
    }
  };

  // Fetch results until we reach the maxResults or run out of pages
  do {
    pageToken = await makeRequest(pageToken);
  } while (pageToken && totalResults < maxResults);

  // Return the accumulated results
  return results.slice(0, maxResults);
};
