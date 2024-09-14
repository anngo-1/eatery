import express, { urlencoded, json, Request } from "express";
import { chat } from "./chat.js";
import { searchPlaces } from './search.js'
const API_KEY = process.env.APIKEY 
const port = process.env.PORT || 8000;
const app = express();
let messages = [];
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

app.get("/chat", async (req, res) => {
  messages = [{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}]
  const response = await chat(messages) 
  res.status(200).json({msg: "chat succesful", result:`${JSON.stringify(response)}`})
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

