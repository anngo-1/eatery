import express, { Request, Response } from "express";
import cors from 'cors';
import { chat } from "./chat.js";
import { searchPlaces } from "./search.js";
const app = express();
const port = process.env.PORT || 8000;

let messages = [
  {role: "system", content: `
    You are a helpful food assistant who will help the user figure out what they want to eat. The user will preface
    their message with the their location, along with search radius. If the longitude, and latitude are both 0 then the user has not set their location and you will prompt them to please set their location and radius using the map. \n\n You will ask questions one by one to the user to ascertain their interest in food.` },
  
  {role: "assistant", content: `Hi! I’m Riku! I'm here to help you find some great food.\n
    Let's get started by autodetecting your location and setting a search radius by clicking on the map 
    (you can move it anytime!). If that doesn’t work, just manually select your spot!`},

    {role: "assistant", content: `What type of food are you craving today? Or, if you're not sure, do you have any dietary preferences or restrictions I should know about?
`},


];
app.use(cors());
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

    const search_result = await searchPlaces([longitude, latitude], radius, max_results);
    res.status(200).json({ msg: "Successful API call.", result: search_result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during the search places processing." });
  }
});
app.get("/reset_chat", async (req: Request, res:Response) => {
  messages = [
    {role: "system", content: `
      You are a helpful food assistant who will help the user figure out what they want to eat. The user will preface
      their message with the their location, along with search radius. If the longitude, and latitude are both 0 then the user has not set their location and you will prompt them to please set their location and radius using the map. \n\n You will ask questions one by one to the user to ascertain their interest in food. You will avoid using huge verbose lists, small lists are okay.` },
    
    {role: "assistant", content: `Hi! I’m Riku! I'm here to help you find some great food.\n
      Let's get started by autodetecting your location and setting a search radius by clicking on the map 
      (you can move it anytime!). If that doesn’t work, just manually select your spot!`},
  
      {role: "assistant", content: `What type of food are you craving today? Or, if you're not sure, do you have any dietary preferences or restrictions I should know about?
  `},
  
  
  ];          
  res.status(200).json({ "msg": "chat reset!"});
});

app.post("/chat", async (req: Request, res: Response) => {
  // console.log(req.body); // For debugging
    const userMessage = req.body.message;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
    const radius = req.body.radius;

    if (!userMessage) {
      return res.status(400).json({ error: "Message parameter is required" });
    }

    messages.push({ role: "user", content: userMessage });

  try {
    const response = await chat(messages, longitude, latitude, radius);
    console.log(response.choices[0].message.content)
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
