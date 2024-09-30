import express, { Request, Response } from "express";
import { chat } from "./chat.js";
import { searchPlaces } from "./search.js";
const app = express();
const port = process.env.PORT || 8000;

let messages = [
  { role: "system", content: "You are a helpful food assistant who will help the user figure out what they want to eat. You can search for restaurants for them, but to do so, you need them to specify the max number of restaurants they want returned back to them, if they don't specify, just give it as 5. You also require their latitude and longitude, along with the radius in miles that they want to search." }
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "This is an's test server. It is up and running!!" });
});

app.get("/searchplaces", async (req: Request, res: Response) => {
  try {
    const longitude = parseFloat(req.query.longitude as string);
    const latitude = parseFloat(req.query.latitude as string);
    const radius = parseFloat(req.query.radius as string);
    const max_results = parseFloat(req.query.mresults as string);

    if (isNaN(longitude) || isNaN(latitude) || isNaN(radius) || isNaN(max_results)) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const search_result = await searchPlaces([latitude, longitude], radius, max_results);
    res.status(200).json({ msg: "Successful API call.", result: search_result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during the search places processing." });
  }
});

app.post("/chat", async (req: Request, res: Response) => {
  // console.log(req.body); // For debugging
    const userMessage = req.body.message;

    if (userMessage == 'reset') {
      messages = [
        { role: "system", content: "You are a helpful food assistant who will help the user figure out what they want to eat. You can search for restaurants for them, but to do so, you need them to specify the max number of restaurants they want returned back to them, if they don't specify, just give it as 5. You also require their latitude and longitude, along with the radius in miles that they want to search." }
      ];
    }
    if (!userMessage) {
      return res.status(400).json({ error: "Message parameter is required" });
    }

    messages.push({ role: "user", content: userMessage });

  try {
    const response = await chat(messages);
    const assistantMessage = response.choices[0].message.content ?? "Sorry, I cannot help you with that";

    messages.push({ role: "assistant", content: assistantMessage });

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during the chat processing." });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
