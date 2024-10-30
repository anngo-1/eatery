import OpenAI from "openai";
import { searchPlaces, textSearchPlaces } from './search.js';

export const chat = async (log: any, longitude: number, latitude: number, radius: number) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAIAPIKEY,
  });

  const functions = [
    {
      name: 'searchPlaces',
      description: 'Search for nearby restaurants/food places based on coordinates and a radius. If the user has a latitude and longitude of 0, this means their location is not set, so prompt them to set their location using the map.',
      parameters: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { type: 'number' },
            description: 'Array with two numbers, longitude and latitude',
          },
          radius: {
            type: 'number',
            description: 'Radius in meters',
          },
          query: {
            type: 'string',
            description: 'Search query for type of food or restaurant',
          }
        },
        required: ['coordinates', 'radius', 'query'],
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: log,
    functions,
    function_call: "auto",
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      "type": "text"
    },
  });

  if (response.choices && response.choices[0].message.function_call) {
    const functionName = response.choices[0].message.function_call.name;
    if (functionName === 'searchPlaces') {
      console.log(longitude);
      console.log(latitude);
      
      // Parse the function arguments from the model
      const functionArgs = JSON.parse(response.choices[0].message.function_call.arguments);
      
      const searchResults = await textSearchPlaces(
        functionArgs.query,
        [longitude, latitude],
        radius,
        60
      );
      
      console.log(JSON.stringify(searchResults));
      
      const finalMessages = [
        ...log,
        response.choices[0].message,
        {
          role: 'function',
          name: 'searchPlaces',
          content: JSON.stringify(searchResults),
        },
      ];

      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: finalMessages,
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
          "type": "text"
        },
      });

      return { response: finalResponse, search_results: searchResults };
    }
  }
  
  return { response: response, search_results: {} };
};