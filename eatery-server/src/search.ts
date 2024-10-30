import fetch from 'node-fetch';

interface Place {
  displayName: { text: string };
  formattedAddress: string;
  priceLevel?: number;
  editorialSummary?: { text: string };
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Added to store calculated distance
}

interface ApiResponse {
  places: Place[];
  nextPageToken?: string;
  error?: any;
}

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const earthRadius = 6371e3; // Earth's radius in meters
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const latDiff = (lat2 - lat1) * Math.PI / 180;
  const lonDiff = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c; // Distance in meters
};

export const searchPlaces = async (coordinates: number[], radius: number, max_results: number) => {
  const API_KEY = process.env.APIKEY;
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY || 'FAIL',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.editorialSummary,places.websiteUri,places.rating,places.userRatingCount,places.location'
  };
  
  const data = {
    includedTypes: ["restaurant"],
    maxResultCount: 20,
    locationRestriction: {
      "circle": {
        "center": {
          "latitude": coordinates[1],
          "longitude": coordinates[0]
        },
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
    const json = await response.json() as ApiResponse;
    
    if (json.places) {
      // Calculate distances and filter results
      json.places = json.places
        .map(place => {
          if (place.location) {
            const distance = calculateDistance(
              coordinates[1],
              coordinates[0],
              place.location.latitude,
              place.location.longitude
            );
            return { ...place, distance };
          }
          return place;
        })
        .filter(place => place.distance !== undefined && place.distance <= radius)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
    return "there was an error.";
  }
};

export const textSearchPlaces = async (query: string, coordinates: number[], radius: number, max_results: number) => {
  const API_KEY = process.env.APIKEY;
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY || 'FAIL',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.editorialSummary,places.websiteUri,places.rating,places.userRatingCount,places.location,nextPageToken'
  };

  let results: Place[] = [];
  let pageToken: string | undefined = undefined;
  let totalResults = 0;

  do {
    const data = {
      textQuery: query,
      pageSize: 20,
      locationBias: {
        "circle": {
          "center": {
            "latitude": coordinates[1],
            "longitude": coordinates[0]
          },
          "radius": radius
        }
      },
      ...(pageToken && { pageToken })
    };

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      const json = await response.json() as ApiResponse;
      
      if (json.error) {
        console.error(json.error);
        return "there was an error.";
      }

      if (json.places) {
        // Calculate distances and filter results before adding to results array
        const filteredPlaces = json.places
          .map(place => {
            if (place.location) {
              const distance = calculateDistance(
                coordinates[1],
                coordinates[0],
                place.location.latitude,
                place.location.longitude
              );
              return { ...place, distance };
            }
            return place;
          })
          .filter(place => place.distance !== undefined && place.distance <= radius)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        results = results.concat(filteredPlaces);
        totalResults = results.length;
      }

      pageToken = json.nextPageToken;
    } catch (error) {
      console.error(error);
      return "there was an error.";
    }
  } while (pageToken && totalResults < max_results);

  console.log(results);
  return {
    places: results.slice(0, max_results)
  };
};