import React, { useState } from "react";
import { Flex, Textarea, IconButton, InputGroup, Input, InputRightElement, Button, Icon, useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { SettingsIcon } from "@chakra-ui/icons";
import { Message } from "./Chatbot";

interface MessageInputProps {
  handleSendMessage: (inputValue: string) => void;
  setMessage: (inputValue: Message[]) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ handleSendMessage, setMessage }) => {
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

  const { isOpen, onOpen, onClose } = useDisclosure()

  const reset_chat = async () => {
    const response = await fetch('http://localhost:8000/reset_chat', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    setMessage([
      {
        id: 0,
        sender: "bot",
        text: `Hi! I’m Riku! I'm here to help you find some great food.\nLet's get started by autodetecting your location and setting a search radius by clicking on the map (you can move it anytime!). If that doesn’t work, just manually select your spot! \nIf you want to restart our conversation, just type \"restart\" and nothing else!`,
      },
      {
        id: 1,
        sender: "bot",
        text: `What type of food are you craving today? Or, if you're not sure, do you have any dietary preferences or restrictions I should know about?`,
      },
    ])

  };
  return (
    <Flex pb={4} pl={4} pr={1} as="form" onSubmit={(e) => e.preventDefault()} w="100%">
      <InputGroup size='md'>

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
        <InputRightElement mt="1">
          <IconButton
            icon={<FiSend />}
            aria-label="Send"
            mr={3}
            bg="gray.700"
            width='4rem'
            color="white"
            _hover={{ bg: "gray.600" }}
            borderRadius="lg"
            onClick={onSend}
            transition="background-color 0.2s"
          />
        </InputRightElement>
      </InputGroup>
      <Flex alignItems={'center'}>
          <Button  bg='white' onClick={onOpen} _hover={{ bg: "white" }}>
            <Icon as={SettingsIcon} boxSize={6} />
          </Button>

          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Settings</ModalHeader>
              <ModalCloseButton />
              <ModalBody borderRadius='xl' pb={1}>
                <Button bg='red.500' mr={3} onClick={reset_chat}>
                  Reset Chat
                </Button>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='gray' ml={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
    </Flex>
  );
};

export default MessageInput;

