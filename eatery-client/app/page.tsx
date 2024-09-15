import { Box, ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Chatbot from '../components/chatbot';
import Nav from '../components/navbar';
import Feed from '../components/feed'; // Adjust the path as needed
import { FeedItemData, LocationMapProps } from '../components/map';
import LocationMap from '../components/map';
// Sample feed data
const feedData: FeedItemData[] = [
  { id: 1, title: 'Cafe Delight', description: 'Best coffee in town', image: '/coffee.jpg', rating: 4.8 },
  { id: 2, title: 'Pizza House', description: 'Delicious pizza with fresh ingredients', image: '/pizza.jpg', rating: 4.5 },
  { id: 3, title: 'Burger Stop', description: 'Juicy burgers at affordable prices', image: '/burger.jpg', rating: 4.7 },
  { id: 4, title: 'Sushi Place', description: 'Fresh sushi rolls and more', image: '/sushi.jpg', rating: 4.9 },
  // Add more items to test scrolling
];
export default function Home() {
  return (
    <ChakraProvider>
      <Nav />
      <Box
        borderColor="gray.200"
        borderRadius={16}
        border="0px"
        p={4}
        maxW='100vw'
        minH="100vh"
        display="flex"
        flexDirection="column"
      >
        <Tabs variant="enclosed" colorScheme="blackWhite" display="flex" flexDirection="column">
          <TabList borderBottom="1px" borderColor="gray.200">
            <Tab
              _selected={{ color: 'black', borderBottom: '2px solid black' }}
              _hover={{ color: 'gray.600' }}
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 2, md: 4 }}
              py={{ base: 1, md: 2 }}
              fontWeight="semibold"
            >
              Chat
            </Tab>
            <Tab
              _selected={{ color: 'black', borderBottom: '2px solid black' }}
              _hover={{ color: 'gray.600' }}
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 2, md: 4 }}
              py={{ base: 1, md: 2 }}
              fontWeight="semibold"
            >
              Feed
            </Tab>
            <Tab
              _selected={{ color: 'black', borderBottom: '2px solid black' }}
              _hover={{ color: 'gray.600' }}
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 2, md: 4 }}
              py={{ base: 1, md: 2 }}
              fontWeight="semibold"
            >
              Location
            </Tab>
            <Tab
              _selected={{ color: 'black', borderBottom: '2px solid black' }}
              _hover={{ color: 'gray.600' }}
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 2, md: 4 }}
              py={{ base: 1, md: 2 }}
              fontWeight="semibold"
            >
              Settings
            </Tab>
          </TabList>

          <TabPanels flex="1" display="flex" flexDirection="column">
            <TabPanel display="flex" flexDirection="column" flex="1">
              <Box
                borderColor="gray.200"
                borderRadius={12}
                border="1px"
                flex="1"
                p={4}
                display="flex"
                flexDirection="column"
              >
                <Chatbot />
              </Box>
            </TabPanel>

            <TabPanel display="flex" flexDirection="column" flex="1">
              <Box
                borderColor="gray.200"
                borderRadius={12}
                border="1px"
                flex="1"
                maxH='78.5vh'
                p={4}
                overflow="auto"
              >
                <Feed feedData={feedData} />
              </Box>
            </TabPanel>

            <TabPanel display="flex" flexDirection="column" flex="1">
              <Box
                borderColor="gray.200"
                borderRadius={12}
                border="1px"
                flex="1"
                p={4}
                overflow="auto"
              >
                <LocationMap feedData={feedData}/>
              </Box>
            </TabPanel>

            <TabPanel display="flex" flexDirection="column" flex="1">
              <Box
                borderColor="gray.200"
                borderRadius={12}
                border="1px"
                flex="1"
                p={4}
                overflow="auto"
              >
                {/* Placeholder for Settings component */}
                <p>Settings content goes here</p>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

