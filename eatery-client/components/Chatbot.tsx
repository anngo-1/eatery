'use client';
import React, { useState, useRef } from "react";
import { Flex, Box, Spinner, Text } from "@chakra-ui/react";
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import { FeedItemData } from './FeedItem';
import { FeedMap } from "@/app/page";

// Define the structure for the API response for search results
interface Place {
  displayName: {
    text: string;
    languageCode: string;
  };
  editorialSummary: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  priceLevel: string; // Assuming this is a string
  rating: number;
  websiteUri: string;
  imageUri?: string; // Optional image field
}

interface SearchResults {
  places: Place[];
}

interface BotResponse {
  messages: { content: string }[];
  search_results: SearchResults;
}

export type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

export interface ChatbotProps {
  position: { lat: number; lng: number };
  radius: number;
  feed: FeedMap;
  addFeed: (newItem: FeedItemData) => void; 
  setFeed: (newFeed: FeedItemData[]) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ position, radius, feed, addFeed, setFeed }) => {
  const starter_message: Message[] = [
    {
      id: 0,
      sender: "bot",
      text: `Hi! I’m Riku! I'm here to help you find some great food.\nLet's get started by autodetecting your location and setting a search radius by clicking on the map (you can move it anytime!). If that doesn’t work, just manually select your spot! \nIf you want to restart our conversation, just type "restart" and nothing else!`,
    },
    {
      id: 1,
      sender: "bot",
      text: `What type of food are you craving today? Or, if you're not sure, do you have any dietary preferences or restrictions I should know about?`,
    },
  ];

  const [messages, setMessages] = useState<Message[]>(starter_message);
  const [thinking, setThinking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (inputValue: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
    };

    if (inputValue === "restart") {
      setMessages(starter_message);
    } else {
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setThinking(true);

      const latLng = position || { lat: 0, lng: 0 }; // Fallback if position is null

      const botResponseText = await getBotResponse(
        `PARAMETERS:\n LATITUDE:${latLng.lat} LONGITUDE:${latLng.lng} RADIUS:${radius * 1609.34}\n${userMessage.text}`
      );

      const botMessage: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: botResponseText,
      };

      setThinking(false);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  const getBotResponse = async (userInput: string): Promise<string> => {
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput, longitude: position.lng, latitude: position.lat, radius: (radius * 1609.34) }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: BotResponse = await response.json();
    console.log(data);

    //update feed
    if (data.search_results && data.search_results.places) {
      data.search_results.places.forEach((place) => {
        // Check if the name is already in the feed
        const isAlreadyInFeed = feed[place.displayName.text] !== undefined; // Check if name exists

        if (!isAlreadyInFeed) {
          addFeed({
            id: Object.keys(feed).length + 1, // Generate a unique ID
            name: place.displayName.text,
            description: place.editorialSummary?.text || 'No description available', // Use optional chaining and fallback
            address: place.formattedAddress,
            price: place.priceLevel || 'N/A', // Fallback if priceLevel is undefined
            image: place.imageUri || '', // Handle optional image URI
            website: place.websiteUri || '', // Handle optional website URI
            rating: place.rating || 0, // Fallback if rating is undefined
          });
        }
      });
    }

    const assistantResponse = data.messages[data.messages.length - 1];
    if (!assistantResponse || !assistantResponse.content) {
      throw new Error('No valid assistant response received');
    }

    return assistantResponse.content;
  };

  return (
    <Flex overflowX='hidden' direction="column" align="center" justify="center" w="100%" h="100%" bg="transparent">
      <Box
        bg="transparent"
        w="100%"
        h="100%"
        p={0}
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
      >
        {/* Chat Messages */}
        <ChatMessages messages={messages} messagesEndRef={messagesEndRef} thinking={thinking} />

        {thinking && (
          <Flex align="center" justify="flex-start" ml={6} mb={4} w="100%">
            <Spinner size="sm" color="gray.500" />
            <Text ml={2} color="gray.500">Riku is thinking...</Text>
          </Flex>
        )}

        {/* Input Box */}
        <MessageInput handleSendMessage={handleSendMessage} setMessage={setMessages} />
      </Box>
    </Flex>
  );
};

export default Chatbot;
