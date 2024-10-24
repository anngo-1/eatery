'use client'
import { Box, ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import Nav from '../components/Navbar';
import { FeedItemData } from '../components/FeedItem';
import MapFeed from '../components/MapFeed';

const initialFeedData: FeedItemData[] = [
];

export type FeedMap = { [key: string]: FeedItemData };

export default function Home() {
  const [feedData, setFeedData] = useState<FeedItemData[]>(initialFeedData);

  const addFeedItem = (newItem: FeedItemData) => {
    setFeedData((prevFeedData) => [...prevFeedData, newItem]);
  };

  const feedMap: FeedMap = feedData.reduce((map: FeedMap, item: FeedItemData) => {
    map[item.name] = item;
    return map;
  }, {});

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
        {/* Render MapFeed and pass feedMap */}
        <MapFeed feedData={feedMap} addFeed={addFeedItem} setFeed = {setFeedData}/>

      </Box>
    </ChakraProvider>
  );
}
