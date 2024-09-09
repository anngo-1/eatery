import { Box, ChakraProvider } from '@chakra-ui/react'
import Nav from './navbar'
import Filter from'../components/filter_bar';
export default function Home() {

  return (
  <ChakraProvider>

    
     <Nav/>
    <Box>


    </Box>

  </ChakraProvider>
  ); 
}
