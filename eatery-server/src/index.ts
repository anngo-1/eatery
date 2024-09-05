import express, { urlencoded, json } from "express";
import fetch from 'node-fetch';

const API_KEY = process.env.APIKEY 
const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

const searchPlaces = async (coordinates : Number[], radius: Number, max_results : Number) => {
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY || 'NO_API_KEY_REQUEST_GONNA_FAIL',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel'
  };

  const data = {
  includedTypes: ["restaurant"],
  maxResultCount: max_results,
  locationRestriction: {
    "circle": {
      "center": {
        "latitude": coordinates[0], // 37.7937
        "longitude": coordinates[1]}, //-122.3965
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

app.get("/", (req, res) => {
  res.status(200).json({ msg: "This is an's test server. It is up and running!!" });
});


app.get("/searchplaces", async (req, res) => {
  const search_result = await searchPlaces([37.7937, -122.3965], 500.0, 10) 
  res.status(200).json({msg: "successful API call.", result:`${JSON.stringify(search_result)}`})
});



app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

