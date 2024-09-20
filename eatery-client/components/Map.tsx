// components/Map.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, Spinner, Text, VStack, Flex, Input, Stack, FormControl, FormLabel } from '@chakra-ui/react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Icon } from '@chakra-ui/react';
import { FaMapMarkerAlt } from 'react-icons/fa';

import 'leaflet/dist/leaflet.css';

interface MapProps {
  position: { lat: number; lng: number } | null;
  setPosition: (position: { lat: number; lng: number }) => void;
  radius: number;
  handleRadiusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInitializeMap: () => void;
  handleManualMode: () => void;
  showMap: boolean;
  fetchingLocation: boolean;
}

const milesToMeters = (miles: number) => miles * 1609.34;

function MapEvents({ setPosition }: { setPosition: (latlng: L.LatLng) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const handleClick = (e: L.LeafletMouseEvent) => {
      setPosition(e.latlng);
    };
    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, setPosition]);

  return null;
}

const Map: React.FC<MapProps> = ({
  position,
  setPosition,
  radius,
  handleRadiusChange,
  handleInitializeMap,
  handleManualMode,
  showMap,
  fetchingLocation,
}) => {
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [radiusInput, setRadiusInput] = useState(radius === 0 ? '' : radius.toString());

  const center: L.LatLngExpression = position ? [position.lat, position.lng] : [51.505, -0.09];

  useEffect(() => {
    if (zoomLevel === 5) {
      setLoading(false);
    }
  }, [zoomLevel]);


const onRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setRadiusInput(value);

  const newRadius = value === '' ? 0 : Math.max(0, parseFloat(value));

  const syntheticEvent = {
    target: {
      value: newRadius.toString(), // Ensure this is a string
    },
  } as React.ChangeEvent<HTMLInputElement>;

  handleRadiusChange(syntheticEvent);
};
  useEffect(() => {
    setRadiusInput(radius === 0 ? '' : radius.toString());
  }, [radius]);  if (!showMap) {
    return (
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
            onClick={() => { handleManualMode(); setZoomLevel(5); }}
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
    </Flex>    );
  }

  return (
    <Box position="relative" h="100%" w="100%">
      {loading && (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
          <Spinner size="xl" />
        </Box>
      )}
      <MapContainer
        center={center}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents setPosition={setPosition} />
        {position && (
          <Circle
            center={[position.lat, position.lng]}
            radius={milesToMeters(radius)}
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
        maxWidth="200px"
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel fontSize="sm">Search Radius (miles)</FormLabel>
            <Input 
              type="text"
              value={radiusInput}
              onChange={onRadiusChange}
              size="sm"
              pattern="[0-9]*\.?[0-9]*"
            />
          </FormControl>
        </Stack>
      </Box>
      {position && (
        <Box 
          position="absolute" 
          bottom={4} 
          left={4} 
          zIndex={1000} 
          p={2} 
          bg="white" 
          borderRadius="md" 
          shadow="md"
        >
          <Text fontSize="sm" fontWeight="bold">
            Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Map;

