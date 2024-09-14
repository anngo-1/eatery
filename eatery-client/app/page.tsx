import { Box, ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Chatbot from '../components/chatbot';
import Nav from '../components/navbar';
import Feed from '../components/feed'; // Adjust the path as needed
import { FeedDataType } from '../components/feed';
import LocationMap from '../components/map';
// Sample feed data
const feedData: FeedDataType = [
  {
    id: 1,
    title: "Pizza Place",
    description: "Delicious pizza with a variety of toppings.",
    image: "https://example.com/pizza.jpg",
    rating: 4.5
  },
  {
    id: 2,
    title: "Burger Joint",
    description: "Juicy burgers with fresh ingredients.",
    image: "https://example.com/burger.jpg",
    rating: 4.2
  },
  {
    id: 3,
    title: "Sushi Spot",
    description: "Fresh sushi with an array of choices.",
    image: "https://example.com/sushi.jpg",
    rating: 4.8
  },
  {
    id: 4,
    title: "Taco Stand",
    description: "Authentic tacos with homemade salsa.",
    image: "https://example.com/tacos.jpg",
    rating: 4.4
  },
  {
    id: 5,
    title: "Indian Bistro",
    description: "Rich and flavorful Indian cuisine.",
    image: "https://example.com/indian.jpg",
    rating: 4.7
  },
  {
    id: 6,
    title: "Mediterranean Grill",
    description: "Fresh Mediterranean dishes with vibrant flavors.",
    image: "https://example.com/mediterranean.jpg",
    rating: 4.6
  },
  {
    id: 7,
    title: "Chinese Express",
    description: "Quick and tasty Chinese food.",
    image: "https://example.com/chinese.jpg",
    rating: 4.3
  },
  {
    id: 8,
    title: "Vegan Delight",
    description: "Delicious and healthy vegan options.",
    image: "https://example.com/vegan.jpg",
    rating: 4.5
  },
  {
    id: 9,
    title: "Seafood Shack",
    description: "Fresh seafood caught daily.",
    image: "https://example.com/seafood.jpg",
    rating: 4.8
  },
  {
    id: 10,
    title: "Steakhouse",
    description: "Premium cuts of steak and classic sides.",
    image: "https://example.com/steak.jpg",
    rating: 4.6
  },
  {
    id: 11,
    title: "Dessert Bar",
    description: "Indulge in a variety of sweet treats.",
    image: "https://example.com/dessert.jpg",
    rating: 4.7
  },
  {
    id: 12,
    title: "French Bistro",
    description: "Classic French dishes and pastries.",
    image: "https://example.com/french.jpg",
    rating: 4.4
  },
  {
    id: 13,
    title: "Korean BBQ",
    description: "Grill your own Korean BBQ at the table.",
    image: "https://example.com/korean.jpg",
    rating: 4.7
  },
  {
    id: 14,
    title: "Bagel Shop",
    description: "Freshly baked bagels with a variety of toppings.",
    image: "https://example.com/bagels.jpg",
    rating: 4.3
  },
  {
    id: 15,
    title: "Sushi Fusion",
    description: "Innovative sushi rolls with unique flavors.",
    image: "https://example.com/sushi-fusion.jpg",
    rating: 4.6
  },
  {
    id: 16,
    title: "BBQ Joint",
    description: "Smoky BBQ with all the fixings.",
    image: "https://example.com/bbq.jpg",
    rating: 4.5
  },
  {
    id: 17,
    title: "Ramen House",
    description: "Hearty ramen bowls with rich broth.",
    image: "https://example.com/ramen.jpg",
    rating: 4.6
  },
  {
    id: 18,
    title: "Tapas Bar",
    description: "Small plates of Spanish-inspired tapas.",
    image: "https://example.com/tapas.jpg",
    rating: 4.4
  },
  {
    id: 19,
    title: "Gourmet Pizza",
    description: "Artisan pizzas with gourmet ingredients.",
    image: "https://example.com/gourmet-pizza.jpg",
    rating: 4.7
  },
  {
    id: 20,
    title: "Italian Trattoria",
    description: "Traditional Italian dishes and a cozy atmosphere.",
    image: "https://example.com/italian.jpg",
    rating: 4.8
  }
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
                <LocationMap/>
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

