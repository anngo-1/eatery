import { Box, ChakraProvider } from '@chakra-ui/react'
import Nav from './navbar'
import Filter from'../components/filter_bar';
export default function Home() {

  return (
  <ChakraProvider>

    
     <Nav/>
     <Box
      borderColor="black"
      borderRadius={48}
      border="1px" 
      m={4}
      css={{
        resize: "vertical",    // Allows the box to be resized both vertically and horizontally
        overflow: "auto",  // Ensures that content inside remains scrollable
        height: "800px", // Set a minimum height and width for better resizing control
      }}
    >

    </Box>  

  </ChakraProvider>
  ); 
}
