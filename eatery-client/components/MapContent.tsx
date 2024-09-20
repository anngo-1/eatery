// components/MapContent.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Input, Stack, FormControl, FormLabel, Text, Spinner } from '@chakra-ui/react';

import 'leaflet/dist/leaflet.css';

interface MapContentProps {
  position: { lat: number; lng: number } | null;
  setPosition: (position: { lat: number; lng: number }) => void;
  radius: number;
  handleRadiusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

const MapContent: React.FC<MapContentProps> = ({
  position, setPosition, radius, handleRadiusChange
}) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const center: L.LatLngExpression = position ? [position.lat, position.lng] : [51.505, -0.09];

  useEffect(() => {
    if (map) {
      setLoading(false);
    }
  }, [map]);

  return (
    <Box position="relative" h="100%" w="100%">
      {loading && (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
          <Spinner size="xl" />
        </Box>
      )}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents setPosition={setPosition} />
        {position && (
          <>
            <Marker position={[position.lat, position.lng]} />
            <Circle
              center={[position.lat, position.lng]}
              radius={milesToMeters(radius)}
              pathOptions={{ color: 'black', fillColor: 'white', fillOpacity: 0.2, weight: 2 }}
            />
          </>
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
            <Input type="number" value={radius} onChange={handleRadiusChange} size="sm" />
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

export default MapContent;

