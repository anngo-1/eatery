import express, { urlencoded, json } from "express";
import fetch from 'node-fetch';

const API_KEY = process.env.APIKEY 
const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

const searchPlaces = async () => {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY || 'NO_API_KEY_REQUEST_GONNA_FAIL',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel'
  };

  const data = {
    textQuery:  'Spicy Vegetarian Food in Sydney, Australia'
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
    throw error;
  }
};

app.get("/", (req, res) => {
  res.status(200).json({ msg: "This is an's test server. It is up and running!!" });
});


app.get("/searchplaces", (req, res) => {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const headers =  {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel'
  };

  const data = {
    textQuery: 'Spicy Vegetarian Food in Sydney, Australia'
  };

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  };

  try {
    const response = fetch(url, options);
    const json =  await response.json();
    return json;
  } catch (error) {
    console.log(error)
    throw(error)
    
  }


});



app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

