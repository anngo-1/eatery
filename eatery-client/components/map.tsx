'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Box, Input, Stack, FormControl, FormLabel,
  Button, Spinner, Text, HStack, Divider, VStack, Icon, Image,
  useBreakpointValue, useToast, Flex
} from '@chakra-ui/react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

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
  <HStack spacing={4} p={4} borderWidth={1} borderRadius="md" borderColor="gray.200" bg="white" shadow="md" w="100%">
    <Image boxSize="100px" objectFit="cover" borderRadius="md" src={item.image} alt={item.title} />
    <VStack align="start" spacing={2} flex="1">
      <Text fontWeight="bold" fontSize="lg">{item.title}</Text>
      <Text fontSize="sm" color="gray.600">{item.description}</Text>
      <HStack spacing={1}>
        <Icon as={FaStar} color="yellow.400" />
        <Text fontSize="sm">{item.rating}</Text>
      </HStack>
      <Button colorScheme="gray" size="sm" mt={2}>Order Now</Button>
    </VStack>
  </HStack>
);

const Feed: React.FC<{ feedData: FeedItemData[] }> = ({ feedData }) => (
  <Box p={4}>
    {feedData.map(item => (
      <React.Fragment key={item.id}>
        <FeedItem item={item} />
        <Divider my={4} />
      </React.Fragment>
    ))}
  </Box>
);

function MapEvents({ setPosition }: { setPosition: (latlng: L.LatLng) => void }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.setView(e.latlng, map.getZoom());
    },
  });
  return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ feedData }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [radius, setRadius] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [fetchingLocation, setFetchingLocation] = useState<boolean>(false);
  const [manualMode, setManualMode] = useState<boolean>(false);
  const center: L.LatLngExpression = [51.505, -0.09];

  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [feedVisible, setFeedVisible] = useState<boolean>(!isMobile);

  useEffect(() => {
    setFeedVisible(!isMobile);
  }, [isMobile]);

  const handleRadiusChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setRadius(0.1);
    } else {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        setRadius(parsedValue);
      }
    }
  }, []);

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
      }
    );
  };

  const handleManualMode = () => {
    setPosition(L.latLng(38.7946, -106.5348));
    setShowMap(true);
    setManualMode(true);
  };

  const mapWidth = useBreakpointValue({ base: '100%', md: '75%' });
  const feedWidth = useBreakpointValue({ base: '100%', md: '25%' });

  return (
    <Box position="relative" h="75vh" w="100%" display="flex" flexDirection={{ base: 'column', md: 'row' }} bg="gray.100">
      <Box position="relative" h={{ base: feedVisible ? '50%' : '100%', md: '100%' }} w={{ base: '100%', md: mapWidth }}>
        {showMap ? (
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={position || center}
            zoom={13}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            <MapEvents setPosition={setPosition} />
            {position && (
              <Circle
                center={position}
                radius={milesToMeters(radius)}
                pathOptions={{ color: 'black', fillColor: 'white', fillOpacity: 0.2, weight: 2 }}
              />
            )}
          </MapContainer>
        ) : (
          <Flex
            justifyContent="center"
            alignItems="center"
            height="100%"
            bg="gray.50"
          >
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              shadow="xl"
              width="90%"
              maxWidth="400px"
              textAlign="center"
            >
              <Icon as={FaMapMarkerAlt} w={12} h={12} color="gray.600" mb={4} />
              <Text fontSize="xl" fontWeight="bold" mb={4}>Select Map Initialization</Text>
              <VStack spacing={4}>
                <Button
                  colorScheme="gray"
                  onClick={handleInitializeMap}
                  width="100%"
                  leftIcon={<Icon as={FaMapMarkerAlt} />}
                >
                  Auto-detect Location
                </Button>
                <Button
                  colorScheme="gray"
                  variant="outline"
                  onClick={handleManualMode}
                  width="100%"
                >
                  Pick Manually
                </Button>
              </VStack>
              {fetchingLocation && (
                <Box mt={4} display="flex" flexDirection="column" alignItems="center">
                  <Spinner size="lg" color="gray.500" mb={2} />
                  <Text>Detecting location...</Text>
                </Box>
              )}
            </Box>
          </Flex>
        )}

        {showMap && (
          <Box
            position="absolute"
            bottom={2}
            left={2}
            zIndex={1000}
            p={2}
            bg="white"
            borderRadius="md"
            shadow="md"
            fontSize={{ base: "xs", md: "sm" }}
          >
            <Text fontWeight="bold">{isMobile ? "Tap" : "Click"} to set location</Text>
          </Box>
        )}

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
              <Input
                type="number"
                value={radius}
                onChange={handleRadiusChange}
                size="sm"
                width="100%"
                placeholder="Enter radius"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "black", boxShadow: "0 0 0 1px black" }}
              />
            </FormControl>
          </Stack>
        </Box>
      </Box>
      
      <Box
        h={{ base: feedVisible ? '50%' : '0', md: '100%' }}
        w={{ base: '100%', md: feedWidth }}
        overflowY="auto"
        overflowX="hidden"
        bg="white"
        transition="all 0.3s ease"
        display={feedVisible ? 'block' : 'none'}
        borderLeft={{ md: '1px solid' }}
        borderColor={{ md: 'gray.200' }}
      >
        <Feed feedData={feedData} />
      </Box>

      <Button
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        bottom={4}
        right={4}
        size="sm"
        colorScheme="gray"
        zIndex={1000}
        onClick={() => setFeedVisible(!feedVisible)}
        boxShadow="lg"
      >
        {feedVisible ? 'Hide Feed' : 'Show Feed'}
      </Button>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh" position="absolute" top={0} left={0} width="100%" bg="rgba(255, 255, 255, 0.7)">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Spinner size="xl" color="gray.500" mb={4} />
            <Text fontSize="lg">Loading map...</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LocationMap
