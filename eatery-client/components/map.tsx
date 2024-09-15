'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box, Input, Checkbox, Stack, FormControl, FormLabel,
  Button, Spinner, Text, HStack, Icon, Divider, VStack, Image,
  useBreakpointValue, useDisclosure
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

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
      <Button colorScheme="teal" size="sm" mt={2}>Order Now</Button>
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

const LocationMap: React.FC<LocationMapProps> = ({ feedData }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [radius, setRadius] = useState<number>(500);
  const [loading, setLoading] = useState<boolean>(true);
  const mapRef = useRef<L.Map | null>(null);
  const center: L.LatLngExpression = [51.505, -0.09];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRadiusChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseFloat(event.target.value));
  }, []);

  function MapEvents() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return null;
  }

  const invalidateMapSize = () => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      invalidateMapSize();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      invalidateMapSize();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const mapWidth = useBreakpointValue({ base: '100%', md: '75%' });
  const feedWidth = useBreakpointValue({ base: '100%', md: '25%' });

  return (
    <Box position="relative" h="75vh" w="100%">
      <Box position="relative" h="100%" w={mapWidth} float={{ base: 'none', md: 'left' }}>
        <MapContainer
          style={{ height: '100%', width: '100%' }}
          center={center}
          zoom={13}
          ref={mapRef}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />
          <MapEvents />
          {position && (
            <>
              <Marker position={position}>
                <Popup>A marker at {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</Popup>
              </Marker>
              <Circle
                center={position}
                radius={radius}
                pathOptions={{
                  color: '#0000FF',
                  fillColor: 'transparent',
                  fillOpacity: 0.0,
                  weight: 2,
                }}
              />
            </>
          )}
        </MapContainer>

        <Box
          position="absolute"
          top={4}
          right={4}
          zIndex={1000}
          display={{ base: 'none', md: 'block' }}
          p={4}
          bg="white"
          borderRadius="md"
          shadow="md"
          width="auto"
          maxWidth="300px"
        >
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Radius (meters)</FormLabel>
              <Input
                type="number"
                value={radius}
                onChange={handleRadiusChange}
                size="md"
                width="200px"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <Checkbox
                isChecked={true}
                isDisabled
              >
                Display feed
              </Checkbox>
            </FormControl>
          </Stack>
        </Box>
      </Box>

      <Box
        position={{ base: 'absolute', md: 'none' }}
        top={4}
        right={4}
        zIndex={1000}
        display={{ base: 'block', md: 'none' }}
        p={2}
        bg="white"
        borderRadius="md"
        shadow="md"
        width="auto"
        maxWidth="300px"
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel fontSize="sm">Radius (meters)</FormLabel>
            <Input
              type="number"
              value={radius}
              onChange={handleRadiusChange}
              size="sm"
              width="120px"
              fontSize="sm"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <Checkbox
              isChecked={true}
              isDisabled
              size="sm"
            >
              Display feed
            </Checkbox>
          </FormControl>
        </Stack>
      </Box>

      <Box
        position={{ base: 'fixed', md: 'absolute' }}
        top={0}
        right={0}
        bottom={0}
        left={{ base: 0, md: '75%' }}
        p={4}
        bg="rgba(255, 255, 255, 0.9)"
        borderLeftWidth={{ base: '0', md: '1px' }}
        borderColor="gray.200"
        boxShadow="md"
        zIndex={1000}
        overflowY="auto"
        display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      >
        <Button
          display={{ base: 'block', md: 'none' }}
          position="absolute"
          top={4}
          right={4}
          onClick={onClose}
          colorScheme="blue"
        >
          Close Feed
        </Button>
        <Feed feedData={feedData} />
      </Box>

      {!isOpen && (
        <Button
          display={{ base: 'block', md: 'none' }}
          position="absolute"
          bottom={4}
          right={4}
          colorScheme="blue"
          zIndex={1000}
          onClick={onOpen}
        >
          Show Feed
        </Button>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="75vh" position="absolute" top={0} left={0} width="100%" bg="rgba(255, 255, 255, 0.7)">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Spinner size="xl" color="blue.500" mb={4} />
            <Text fontSize="lg">Loading map...</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LocationMap;

