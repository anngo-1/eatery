// This is the component for the filter bar, which filters food 
// items/restaurants on price range, location range, location, and food type/cuisine type  

import { 
  ChakraProvider,
  Box,
  Input,
  Select,
  Button,
  Flex,
  Text,
  Heading



} from "@chakra-ui/react"; 

export interface Filters {
  location: String,
  distance: Number,
  avoid: String,
  include: String,
  pricerange: [Number, Number] // lower bound of price, upper bound of price

} 

export default function Filter (props: Filters) {
  const test: Number = 50


  return( 
    <ChakraProvider>
      <Box padding={4} minH={70} borderColor='gray.200' borderWidth={3/4}>
        <Heading as='h2' size='1xl' marginBottom={4}>Filters</Heading>
        <Flex columnGap='55px' justifyContent={"space-between"}>
          
          <Input borderColor='black' placeholder="Enter a Location"></Input>
          <Select borderColor='black' placeholder="Distance"></Select>
          <Select borderColor='black' placeholder='Select Foods to Avoid'></Select>
          <Select borderColor='black' placeholder='Select Foods to Include'></Select>
          <Button minW={100} borderRadius={10} bg='blue.400'>Search</Button>
         
        </Flex>




      </Box>
    </ChakraProvider>
  
  )



} 
