# This a search script that uses the new Google Place API's nearby search

# Default coordinates
DEFAULT_LAT=32.9164
DEFAULT_LNG=-117.1393
DEFAULT_RADIUS=1609

# Accept optional parameters for latitude and longitude
LAT=${1:-$DEFAULT_LAT}
LNG=${2:-$DEFAULT_LNG}

# API call
source .env
curl -X POST -d '{
  "includedTypes": ["restaurant"],
  "maxResultCount": 10,
  "locationRestriction": {
    "circle": {
      "center": {
        "latitude": '"$LAT"',
        "longitude": '"$LNG"'
      },
      "radius": '"$DEFAULT_RADIUS"'
    }
  }
}' \
-H 'Content-Type: application/json' \
-H "X-Goog-Api-Key: ${APIKEY}" \
-H "X-Goog-FieldMask: places.displayName" \
https://places.googleapis.com/v1/places:searchNearby

