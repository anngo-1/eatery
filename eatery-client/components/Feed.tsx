// components/Feed.tsx
import React from 'react';
import { VStack } from '@chakra-ui/react';
import { FeedItemData } from './FeedItem';
import FeedItem from './FeedItem';
const Feed: React.FC<{ feedData: FeedItemData[] }> = ({ feedData }) => (
  <VStack spacing={4} p={4} overflowY="auto" width="100%">
    {feedData.map(item => (
      <FeedItem key={item.id} item={item} />
    ))}
  </VStack>
);

export default Feed;

