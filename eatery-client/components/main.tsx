'use client'
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Box, Stack, FormControl, FormLabel, ChakraProvider,
  Button, Spinner, Text, HStack, VStack, Icon, Image, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  useBreakpointValue, useToast, Flex, Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import { FaStar, FaMapMarkerAlt, FaComments, FaList } from 'react-icons/fa';
import Chatbot from './chatbot';

export interface FeedItemData {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
}

export interface LocationMapProps {
  feedData: FeedItemData[];
}

const milesToMeters = (miles: number) => miles * 1609.34;

const FeedItem: React.FC<{ item: FeedItemData }> = ({ item }) => (
  <HStack spacing={4} p={4} borderWidth={1} borderRadius="lg" borderColor="gray.200" bg="white" shadow="md" w="100%">
    <Image boxSize="80px" objectFit="cover" borderRadius="md" src={item.image} alt={item.title} />
    <VStack align="start" spacing={2} flex="1">
      <Text fontWeight="bold" fontSize="md">{item.title}</Text>
      <Text fontSize="sm" color="gray.600" noOfLines={2}>{item.description}</Text>
      <HStack spacing={1}>
        <Icon as={FaStar} color="yellow.400" />
        <Text fontSize="sm">{item.rating}</Text>
      </HStack>
    </VStack>
  </HStack>
);

const Feed: React.FC<{ feedData: FeedItemData[] }> = ({ feedData }) => (
  <VStack spacing={4} p={4} overflowY="auto" width="100%">
    {feedData.map(item => (
      <FeedItem key={item.id} item={item} />
    ))}
  </VStack>
);

function MapEvents({ setPosition }: { setPosition: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ feedData }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [radius, setRadius] = useState<string>('1');  // Store the input as a string to allow for empty values
  const [showMap, setShowMap] = useState<boolean>(false);
  const [fetchingLocation, setFetchingLocation] = useState<boolean>(false);
  const [manualMode, setManualMode] = useState<boolean>(false);
  const center: L.LatLngExpression = [51.505, -0.09];
  const geo_options = {
    enableHighAccuracy: false,
    timeout: 60000,
    maximumAge: Infinity
  };
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Error-checked radius change handler
  const handleRadiusChange = (valueAsString: string, valueAsNumber: number) => {
    if (valueAsString === '' || isNaN(valueAsNumber)) {
      setRadius('');  // Allow clearing the input completely
    } else if (valueAsNumber >= 0) {
      setRadius(valueAsString);  // Accept valid input
    } else {
      setRadius('1');  // Fallback to 1 mile if the input is invalid
    }
  };

  const handleInitializeMap = () => {
    toast({
      title: "Detecting Location",
      description: "Using your current location to center the map.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });

    setFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition(L.latLng(latitude, longitude));
        setShowMap(true);
        setFetchingLocation(false);
        setManualMode(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setShowMap(false);
        setFetchingLocation(false);
        toast({
          title: "Location Error",
          description: "Unable to detect your location. Please try manual mode.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
      geo_options
    );
  };

  const handleManualMode = () => {
    setPosition(L.latLng(38.7946, -106.5348));
    setShowMap(true);
    setManualMode(true);
  };

  return (
    <ChakraProvider>
      <Flex direction={{ base: 'column', md: 'row' }} h="100vh" pt="80px"> {/* Add top padding to account for the navbar height */}
        <Box h={{ base: 'calc(50% - 1rem)', md: '100%' }} w={{ base: '100%', md: '60%' }} position="relative" mb={{ base: 0, md: 0 }} mr={{ md: 0 }}>
          {showMap ? (
            <Box position="relative" h="100%">
              <MapContainer
                style={{ height: '100%', width: '100%' }}
                center={position || center}
                zoom={manualMode ? 5 : 13}
                key={manualMode ? 'manual' : 'auto'}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© OpenStreetMap contributors'
                />
                <MapEvents setPosition={setPosition} />
                {position && (
                  <Circle
                    center={position}
                    radius={milesToMeters(parseFloat(radius) || 0)}  // Convert to number, fallback to 0 if empty
                    pathOptions={{ color: 'black', fillColor: 'white', fillOpacity: 0.2, weight: 2 }}
                  />
                )}
              </MapContainer>
              <Box
                position="absolute"
                top={4}
                right={4}
                zIndex={1000}
                p={3}
                bg="white"
                borderRadius="md"
                shadow="md"
                width={{ base: "auto", md: "auto" }}
                maxWidth={{ base: "150px", md: "300px" }}
              >
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>Search Radius (miles)</FormLabel>
                    <NumberInput
                      value={radius}
                      onChange={handleRadiusChange}
                      min={0}
                      precision={2}
                      step={0.1}
                      size="sm"
                      width="100%"
                      borderColor="gray.300"
                      _hover={{ borderColor: "gray.400" }}
                      _focus={{ borderColor: "black", boxShadow: "0 0 0 1px black" }}
                      borderRadius="md"
                      clampValueOnBlur={false}  // Allow users to clear the input
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Flex justifyContent="center" alignItems="center" height="100%" bg="gray.50">
              <Box p={6} bg="white" borderRadius="lg" shadow="xl" width="90%" maxWidth="400px" textAlign="center">
                <Icon as={FaMapMarkerAlt} w={12} h={12} color="gray.600" mb={4} />
                <Text fontSize="xl" fontWeight="bold" mb={4}>Initialize Location</Text>
                <VStack spacing={4}>
                  <Button
                    colorScheme="gray"
                    onClick={handleInitializeMap}
                    width="100%"
                    leftIcon={<Icon as={FaMapMarkerAlt} />}
                    borderRadius="md"
                  >
                    Auto-detect Location
                  </Button>
                  <Button
                    colorScheme="gray"
                    variant="outline"
                    onClick={handleManualMode}
                    width="100%"
                    borderRadius="md"
                  >
                    Pick Manually
                  </Button>
                </VStack>
                {fetchingLocation && (
                  <Box mt={4} display="flex" justifyContent="center" alignItems="center">
                    <Spinner size="md" />
                  </Box>
                )}
              </Box>
            </Flex>
          )}
        </Box>

        {/* Right Sidebar */}
        <Box
          h={{ base: 'calc(50% + 1rem)', md: '100%' }}
          w={{ base: '100%', md: '40%' }}
          bg="white"
          borderLeft={{ md: '1px solid' }}
          borderColor={{ md: 'gray.200' }}
          overflowY="auto"
          borderRadius={{ base: '1rem 1rem 0 0', md: '0' }}
          display="flex"
          flexDirection="column"
        >
          <Tabs isFitted variant="enclosed" height="100%" display="flex" flexDirection="column">
            <TabList mb="1em">
              <Tab
                borderBottom="2px solid transparent"
                _selected={{
                  color: 'black',
                  borderBottom: '2px solid black',
                }}
                _focus={{ boxShadow: 'none' }}
              >
                <Icon as={FaComments} mr={2} /> Chat
              </Tab>
              <Tab
                borderBottom="2px solid transparent"
                _selected={{
                  color: 'black',
                  borderBottom: '2px solid black',
                }}
                _focus={{ boxShadow: 'none' }}
              >
                <Icon as={FaList} mr={2} /> Feed
              </Tab>
            </TabList>
            <TabPanels flex="1" overflowY="auto">
              <TabPanel height="100%" p={0}>
                <Box h="100%" overflowY="auto">
                  <Chatbot />
                </Box>
              </TabPanel>
              <TabPanel height="100%" p={0}>
                <Box h="100%" overflowY="auto">
                  <Feed feedData={feedData} />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default LocationMap;

