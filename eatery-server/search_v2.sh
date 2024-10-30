source .env

# Initialize variables
QUERY="chicken restaurants" # Replace with your search query
MAX_RESULTS=60
RESULTS_COUNT=0
PAGE_TOKEN=""
PAGE_NUMBER=1
BASE_URL="https://places.googleapis.com/v1/places:searchText"

# Function to make API call and process results
make_request() {
    local data="$1"
    local response
    local results_in_page
    
    
    # Make the API call with nextPageToken in the field mask
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "X-Goog-Api-Key: ${APIKEY}" \
        -H "X-Goog-FieldMask: places.displayName,places.formattedAddress,places.id,places.rating,places.photos,nextPageToken" \
        -d "$data" \
        "${BASE_URL}")
    
    # Check for errors in response
    if echo "$response" | jq -e 'has("error")' > /dev/null; then
        echo "Error in API response:"
        echo "$response" | jq '.error'
        exit 1
    fi
    
    # Print results (you can modify this part to process the data as needed)
    echo "$response" #| jq -r '.places[] | "Name: \(.displayName.text), Address: \(.formattedAddress)"'
    
    # Count results in this page
    results_in_page=$(echo "$response" | jq '.places | length')
    RESULTS_COUNT=$((RESULTS_COUNT + results_in_page))
    
    # Get next page token if available
    PAGE_TOKEN=$(echo "$response" | jq -r '.nextPageToken // empty')
    
    
    PAGE_NUMBER=$((PAGE_NUMBER + 1))
}

# Prepare initial request data with location bias
initial_data='{
    "textQuery": "'"$QUERY"'",
    "pageSize": 20,
    "locationBias": {
        "circle": {
            "center": {
                "latitude": 32.9184,
                "longitude": -117.1469
            },
            "radius": 5000.0
        }
    }
}'

# Make initial request
make_request "$initial_data"

# Keep fetching next pages until we reach MAX_RESULTS or no more results available
while [[ $RESULTS_COUNT -lt $MAX_RESULTS && ! -z "$PAGE_TOKEN" ]]; do
    # Small delay to avoid potential rate limiting
    # sleep 2
    
    # Prepare next page request data with location bias
    next_data='{
        "textQuery": "'"$QUERY"'",
        "pageSize": 20,
        "pageToken": "'"$PAGE_TOKEN"'",
        "locationBias": {
            "circle": {
                "center": {
                    "latitude": 32.9184,
                    "longitude": -117.1469
                },
                "radius": 5000.0
            }
        }
    }'
    
    # Make request with page token
    make_request "$next_data"
done

echo "Final total results fetched: $RESULTS_COUNT"
