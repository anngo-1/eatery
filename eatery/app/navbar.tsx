'use client'

import {
  ChakraProvider,
  Box,
  Flex,
  Image,
  Stack,
  Heading
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

interface Props {
  children: React.ReactNode
}

const NavLink= (props: Props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.200'
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Nav() {
  return (
 
    <ChakraProvider>
        <Flex bg='gray.200' p={4} h={20} alignItems={'center'} justifyContent={'space-between'}>
          <Heading as='h2' size='xl'>eatery</Heading>

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
