'use client'
import React, { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  VStack,
  Avatar,
  IconButton,
  useColorModeValue,
  ScaleFade,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // Function to handle sending the message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(""); // Clear input after sending

    // Placeholder: API call for bot response
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

  return (
    <Flex
      minH='75vh'
      direction="column"
      align="center"
      justify="center"
      maxH='75vh'
      w="100%"
      bg="transparent"
    >
      <Box
        minH='75vh'
        maxH='75vh'
        bg="transparent"
        w="100%"
        h="100%"
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {/* Chat Messages */}
        <VStack
          spacing={4}
          align="stretch"
          overflowY="auto"
          flexGrow={1}
          p={4}
          mb={4}
        >
          {messages.map((message) => (
            <ScaleFade key={message.id} initialScale={0.9} in>
              <Flex
                align="center"
                justify={message.sender === "user" ? "flex-end" : "flex-start"}
                w="100%"
              >
                {message.sender === "bot" && (
                  <Avatar size="sm" name="Bot" bg="gray.600" mr={2} />
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
                  <Text>{message.text}</Text>
                </Box>
                {message.sender === "user" && (
                  <Avatar size="sm" name="User" bg="gray.600" ml={2} />
                )}
              </Flex>
            </ScaleFade>
          ))}
        </VStack>

        {/* Input Box */}
        <Flex as="form" onSubmit={(e) => e.preventDefault()} w="100%">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
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

