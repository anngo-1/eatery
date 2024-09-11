'use client'

import {
  ChakraProvider,
  Box,
  Flex,
  Image,
  Stack,
  Heading
} from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

export default function Nav() {
  return (
 
    <ChakraProvider>
        <Flex borderColor='black' borderBottom='1px' bg='white' p={4} h={20} alignItems={'center'} justifyContent={'space-between'}>
          <p className="text-2xl">eatery</p>

          <Flex alignItems={'center'}>
          <Image
            borderRadius='full'
            boxSize='36px'
            src='github.png'
          />


          </Flex>
        </Flex>
    </ChakraProvider>
  )
}
