import fetch from 'node-fetch';
export const searchPlaces = async (coordinates : Number[], radius: Number, max_results : Number) => {
  const API_KEY = process.env.APIKEY
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY || 'FAIL',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.editorialSummary'
  };

  const data = {
  includedTypes: ["restaurant"],
  maxResultCount: max_results,
  locationRestriction: {
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
    return json;
  } catch (error) {
    console.error(error);
    return "there was an error."
    //throw error;
  }
};


