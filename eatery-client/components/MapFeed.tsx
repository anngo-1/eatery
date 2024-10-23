'use client'
import React, { useState, useCallback } from 'react';
import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Icon, useBreakpointValue, ChakraProvider } from '@chakra-ui/react';
import { FaComments, FaList } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Feed from './Feed';
import Chatbot from './Chatbot';
import { FeedItemData } from './FeedItem';
import { FeedMap } from '@/app/page';
import { ChatbotProps } from './Chatbot'
const Map = dynamic(() => import('./Map'), { ssr: false });

interface MapFeedProps {
  feedData: FeedMap;
}

const MapFeed: React.FC<MapFeedProps> = ({ feedData }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(1);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [fetchingLocation, setFetchingLocation] = useState<boolean>(false);


  const handleRadiusChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setRadius(parsedValue);
    }
  }, []);

  const handleInitializeMap = () => {
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setShowMap(true);
        setFetchingLocation(false);
      },
      () => {
        setShowMap(false);
        setFetchingLocation(false);
      }
    );
  };

  const handleManualMode = () => {
    setPosition({ lat: 38.7946, lng: -106.5348 });
    setShowMap(true);
  };

  return (
    <ChakraProvider>
    <Flex direction={{ base: 'column', md: 'row' }} h="100vh" pt="80px"> {/* Add top padding to account for the navbar height */}
        <Box h={{ base: 'calc(50% - 1rem)', md: '100%' }} w={{ base: '100%', md: '60%' }} position="relative" mb={{ base: 0, md: 0 }} mr={{ md: 0 }}>
          <Map
            position={position}
            setPosition={setPosition}
            radius={radius}
            handleRadiusChange={handleRadiusChange}
            handleInitializeMap={handleInitializeMap}
            handleManualMode={handleManualMode}
            showMap={showMap}
            fetchingLocation={fetchingLocation}
          />
        </Box>
        <Box
          h={{ base: 'calc(100vh - 50vh)', md: '100%' }}
          w={{ base: '100%', md: '50%' }}
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
                <Chatbot 
                  position={position ?? { lat: 0, lng: 0 }} 
                  feed={feedData} 
                  radius={radius} 
                />
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

export default MapFeed;

