import OpenAI from "openai";

export const chat = async (log : any) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAIAPIKEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: log,
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      "type": "text"
    },
  });

  return response;

}


