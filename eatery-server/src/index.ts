import express, { urlencoded, json, Request } from "express";
import { chat } from "./chat.js";
import { searchPlaces } from './search.js'
const API_KEY = process.env.APIKEY 
const port = process.env.PORT || 8000;
const app = express();
let messages = [{"role": "system", "content": "You are a helpful assistant." }
];
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

// save this for frontend
app.get("/chat", async (req, res) => {
  messages = [{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}]
  //messages.push({"role": "user", "content":`${req.query.chat}`})
  const response = await chat(messages)
  messages.push({"role":response['choices'][0]['message']['role'], "content":response['choices'][0]['message']['content'] || "Sorry, I cannot help you with that"})
  res.status(200).json({msg: "chat successful", result:`${JSON.stringify(messages)}`})
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

