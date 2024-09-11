import express, { urlencoded, json, Request } from "express";
import { searchPlaces } from './search.js'
const API_KEY = process.env.APIKEY 
const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "This is an's test server. It is up and running!!" });
});


app.get("/searchplaces", async (req, res) => {
  const longitude = parseFloat(req.query.longitude as string)
  const latitude = parseFloat(req.query.latitude as string)
  const radius = parseFloat(req.query.radius as string)
  const max_results = parseFloat(req.query.mresults as string)


  const search_result = await searchPlaces([longitude, latitude], radius, max_results) 
  res.status(200).json({msg: "successful API call.", result:`${JSON.stringify(search_result)}`})
});



app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

