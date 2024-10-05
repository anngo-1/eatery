import React, { useRef, useEffect } from "react";
import { VStack, Flex, Avatar, Box, ScaleFade } from "@chakra-ui/react";
import Markdown from 'react-markdown';
import { Message } from './Chatbot';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  thinking: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, messagesEndRef, thinking }) => {

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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

      {/* Auto-scroll reference */}
      <div ref={messagesEndRef} />
    </VStack>
  );
};

export default ChatMessages;

