'use client'

import {
  ChakraProvider,
  Box,
  Flex,
  Image,
  Text,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react'

import {
  SettingsIcon,
} from '@chakra-ui/icons'
export default function Nav() {
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

  };

  return (
    <ChakraProvider>
      <Flex
        borderColor='black'
        borderBottom='1px'
        bg='white'
        p={4}
        h={20}
        alignItems={'center'}
        justifyContent={'space-between'}
        position='fixed'
        top={0}
        width='100%'
        zIndex={1000}

      >
        <p className="text-2xl">eatery</p>
        <Flex alignItems={'center'}>
          <Button colorScheme='gray' onClick={onOpen}>
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
                <Button colorScheme='gray' mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </Flex>
      </Flex>
    </ChakraProvider>
  )
}
