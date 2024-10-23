import React, { useRef, useEffect } from "react";
import { VStack, Flex, Avatar, Box, ScaleFade, Link as ChakraLink } from "@chakra-ui/react"; // Import Chakra's Link component
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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
              borderColor={message.sender === "user" ? "gray.500" : "gray.300"}
            >
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw]} 
                components={{
                  a: ({href, children}) => (
                    <ChakraLink
                      href={href}
                      color="blue"
                      textDecoration="underline"
                      _hover={{ color: "darkblue" }}
                      isExternal
                    >
                      {children}
                    </ChakraLink>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
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
