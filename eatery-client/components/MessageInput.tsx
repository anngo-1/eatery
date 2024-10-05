import React, { useState } from "react";
import { Flex, Textarea, IconButton } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

interface MessageInputProps {
  handleSendMessage: (inputValue: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ handleSendMessage }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const onSend = () => {
    if (inputValue.trim() === "") return;
    handleSendMessage(inputValue);
    setInputValue(""); // Clear input after sending
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Flex pb={4} pl={4} pr={4} as="form" onSubmit={(e) => e.preventDefault()} w="100%">
      <Textarea
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        flex="1"
        border="1px solid"
        borderColor="gray.500"
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
        onClick={onSend}
        transition="background-color 0.2s"
      />
    </Flex>
  );
};

export default MessageInput;

