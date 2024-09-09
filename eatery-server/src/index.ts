import express, { urlencoded, json } from "express";
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
  const coordinates : Number[] = [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
  const radius = req.query.radius
  const max_results = req.query.mresults


  const search_result = await searchPlaces(coordinates, radius, max_results) 
  res.status(200).json({msg: "successful API call.", result:`${JSON.stringify(search_result)}`})
});



app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

