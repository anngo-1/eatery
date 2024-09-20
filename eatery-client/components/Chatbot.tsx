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
  Textarea,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>
  ([
    {
      id: 0,
      sender: "bot",
      text: `Hi! I’m Riku! I'm here to help you find some great food.\nLet's get started by autodetecting your location and setting a search radius by clicking on the map (you can move it anytime!). If that doesn’t work, just manually select your spot!`
    },

    {
      id: 1,
      sender:"bot",
      text: "Let me know what you're looking for in terms of food, and I'll put those locations on your map and feed!"

    }

  ]); 
  const [inputValue, setInputValue] = useState<string>("");

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

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(""); // Clear input after sending

    const botResponseText = await getBotResponse(userMessage.text);

    const botMessage: Message = {
      id: messages.length + 2,
      sender: "bot",
      text: botResponseText,
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  // Placeholder function for API call to get the bot response
  const getBotResponse = async (userInput: string): Promise<string> => {
    // Simulate API call or logic to fetch bot response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a bot response to: " + userInput);
      }, 1000); // Simulated delay
    });
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
          flexGrow={1}
          p={2}
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
                  <Text whiteSpace="pre-wrap">{message.text}</Text>
                </Box>
                {message.sender === "user" && (
                  <Avatar size="sm" name="User" bg="gray.600" ml={2} />
                )}
              </Flex>
            </ScaleFade>
          ))}
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
