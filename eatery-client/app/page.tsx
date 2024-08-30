import { Box, ChakraProvider } from '@chakra-ui/react'
import Nav from './navbar'
import Filter from'../components/filter_bar';
export default function Home() {

  return (
  <ChakraProvider>

    
     <Nav/>
    <Box>
     <Filter 
      location="San Diego"
      distance={50} 
      include="Chinese"
      avoid="Korean Hotdog"
      pricerange = {[0.00, 25.00]}

      />

    </Box>

  </ChakraProvider>
  ); 
}
