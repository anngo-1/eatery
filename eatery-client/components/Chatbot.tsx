'use client'
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Avatar,
  IconButton,
  ScaleFade,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { FeedItemData } from './FeedItem'
import Markdown from 'react-markdown'

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

export interface ChatbotProps {
  position: { lat: number; lng: number };
  radius: number;
  feed: FeedItemData[]
}
const Chatbot: React.FC<ChatbotProps> = ({ position, radius, feed }) => {

  const starter_message : Message[] = ([
    {
      id: 0,
      sender: "bot",
      text: `Hi! I’m Riku! I'm here to help you find some great food.\nLet's get started by autodetecting your location and setting a search radius by clicking on the map (you can move it anytime!). If that doesn’t work, just manually select your spot! \nIf you want to restart our conversation, just type \"restart\" and nothing else!`
    },

    {
      id: 1,
      sender: "bot",
      text: `What type of food are you craving today? Or, if you're not sure, do you have any dietary preferences or restrictions I should know about?`
    },

  ]); 
  const [messages, setMessages] = useState<Message[]>(starter_message);
  const [inputValue, setInputValue] = useState<string>("");
  const [thinking, setThinking] = useState<Boolean>(false); // State for loading spinner
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
    };

    if (userMessage.text == "restart") {
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");
      fetch("http://localhost:8000/reset_chat");
      setMessages(starter_message);
    } else {
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue(""); // Clear input after sending

      // Start spinner when the bot starts thinking
      setThinking(true);

      if (position == null) {
        position = { lat: 0, lng: 0 };
      }

      const botResponseText = await getBotResponse(
        `PARAMETERS:\n LATITUDE:${position['lat']} LONGITUDE:${position['lng']} RADIUS:${radius*1609.34}` +
        "\n" +
        userMessage.text
      );

      console.log(botResponseText);
      const botMessage: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: botResponseText,
      };

      // Stop spinner once bot's response is received
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
      body: JSON.stringify({ message: userInput }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Extract the assistant's response from the response JSON
    const assistantResponse = data.messages[data.messages.length - 1];

    if (!assistantResponse || !assistantResponse.content) {
      throw new Error('No valid assistant response received');
    }

    return assistantResponse.content;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="100%"
      h="100%"
      bg="transparent"
    >
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
        <VStack
          spacing={2}
          align="stretch"
          overflowY="auto"
          overflowX="hidden"
          flexGrow={1}
          p={4}
          mb={0}
        >
          {messages.map((message) => (
            <ScaleFade key={message.id} initialScale={0.9} in>
              <Flex
                align="center"
                justify={message.sender === "user" ? "flex-end" : "flex-start"}
                w="100%"
              >
                {message.sender === "bot" && (
                  <Avatar src='rikuicon.jpg' size="sm" name="Bot" bg="gray.600" mr={2} />
                )}
                <Box 
                  bg={message.sender === "user" ? "gray.700" : "gray.200"}
                  color={message.sender === "user" ? "white" : "black"}
                  px={4}
                  py={2}
                  borderRadius="lg"
                  maxWidth="75%"
                  fontSize="md"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={message.sender === "user" ? "gray.500" : "gray.300"} // Subtle border
                >
                  <Markdown>{message.text}</Markdown>
                </Box>
                {message.sender === "user" && (
                  <Avatar size="sm" name="User" bg="gray.600" ml={2} />
                )}
              </Flex>
            </ScaleFade>
          ))}

          {/* Spinner for when the bot is thinking */}
          {thinking && (
            <Flex align="center" justify="flex-start" ml = {4} w="100%">
              <Spinner size="sm" color="gray.500" />                  
              <Text ml={2} color="gray.500">Riku is thinking...</Text>
            </Flex>
          )}
          
          <div ref={messagesEndRef} />
        </VStack>

        {/* Input Box */}
        <Flex pb={4} pl={4} pr={4}  as="form" onSubmit={(e) => e.preventDefault()} w="100%">
          <Textarea
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            flex="1"
            border="1px solid"
            borderColor="gray.500" // Thinner border for minimalism
            _focus={{ borderColor: "gray.700" }}
            fontSize="md"
            p={3}
            bg="white"
            color="black"
            borderRadius="lg"
            boxShadow="sm"
            transition="border-color 0.2s"
            resize="none"
            rows={1}
            minHeight="40px"
          />
          <IconButton
            icon={<FiSend />}
            aria-label="Send"
            ml={2}
            bg="gray.700"
            color="white"
            _hover={{ bg: "gray.600" }}
            borderRadius="lg"
            onClick={handleSendMessage}
            transition="background-color 0.2s"
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export default Chatbot;
