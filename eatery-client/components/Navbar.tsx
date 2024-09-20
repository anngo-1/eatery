'use client'
import {
  ChakraProvider,
  Box,
  Flex,
  Image,
  Icon
} from '@chakra-ui/react'

import {
SettingsIcon,
} from '@chakra-ui/icons'
export default function Nav() {
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
         <Icon as={SettingsIcon} boxSize={6}/> 
        </Flex>
      </Flex>
    </ChakraProvider>
  )
}
