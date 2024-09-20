import { Box, ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Nav from '../components/Navbar';
import { FeedItemData } from '../components/FeedItem';
import MapFeed from '../components/MapFeed';
const feedData: FeedItemData[] = [
  { id: 1, title: 'Cafe Delight', description: 'Best coffee in town', image: '/coffee.jpg', rating: 4.8 },
  { id: 2, title: 'Pizza House', description: 'Delicious pizza with fresh ingredients', image: '/pizza.jpg', rating: 4.5 },
  { id: 3, title: 'Burger Stop', description: 'Juicy burgers at affordable prices', image: '/burger.jpg', rating: 4.7 },
  { id: 4, title: 'Sushi Place', description: 'Fresh sushi rolls and more', image: '/sushi.jpg', rating: 4.9 },
];
export default function Home() {
  return (
    <ChakraProvider>
      <Nav />
      <Box
        borderColor="gray.200"
        borderRadius={16}
        border="0px"
        p={0}
        maxW='100vw'
        display="flex"
        flexDirection="column"
      >
               <MapFeed feedData={feedData}/>
      </Box>
    </ChakraProvider>
  );
}

