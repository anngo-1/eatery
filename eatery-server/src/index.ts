import express, { urlencoded, json } from "express";
const API_KEY = process.env.APIKEY 
const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "This is an's test server. It is up and running!!" });
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

