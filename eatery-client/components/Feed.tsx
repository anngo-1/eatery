import React from 'react';
import { VStack } from '@chakra-ui/react';
import { FeedItemData } from './FeedItem';
import FeedItem from './FeedItem';
import { FeedMap } from '@/app/page';

const Feed: React.FC<{ feedData: FeedMap }> = ({ feedData }) => (
  <VStack spacing={4} p={4} overflowY="auto" width="100%">
    {Object.values(feedData).map((item: FeedItemData) => (
      <FeedItem key={item.name} item={item} />
    ))}
  </VStack>
);

export default Feed;
