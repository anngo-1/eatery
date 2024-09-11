import { Box, ChakraProvider } from '@chakra-ui/react'
import Nav from './navbar'
import Filter from'../components/filter_bar';
export default function Home() {

  return (
  <ChakraProvider>

    
     <Nav/>
     <Box
      borderColor="black"
      borderRadius={24}
      border="1px" 
      m={2}
      css={{
        resize: "vertical",    
        overflow: "auto", 
        height: "calc(100vh - 16vh)", 
      }}
    >

    </Box>  

  </ChakraProvider>
  ); 
}
