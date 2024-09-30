import OpenAI from "openai";
import { searchPlaces } from './search.js'; // Adjust the import path as necessary

export const chat = async (log: any) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAIAPIKEY,
  });

  const functions = [
    {
      name: 'searchPlaces', // The name of the function
      description: 'Search for nearby restaurants/food places based on coordinates and a radius. If the user has a latitude and longitude of 0, this means their location is not set, so prompt them to set their location using the map.         ',
      parameters: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { type: 'number' },
            description: 'Array with two numbers, latitude and longitude',
          },
          radius: {
            type: 'number',
            description: 'Radius',
          },
          // max_results: {
          //   type: 'number',
          //   description: 'Maximum number of results',
          // },
        },
        required: ['coordinates', 'radius'],
      },
    },
  ];


  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: log,
    functions,
    function_call: "auto", // Automatically call the function based on message context
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
    const functionParams = JSON.parse(response.choices[0].message.function_call.arguments);

    if (functionName === 'searchPlaces') {
      console.log(functionParams)
      const searchResults = await searchPlaces(
        functionParams.coordinates,
        functionParams.radius,
        15
      );

      console.log(JSON.stringify(searchResults))
      // Incorporate the search results into the final response
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
      return finalResponse;
    }
  }

  return response;
}