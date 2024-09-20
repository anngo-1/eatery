// components/FeedItem.tsx
import React from 'react';
import { HStack, VStack, Text, Icon, Image } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

export interface FeedItemData {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
}

const FeedItem: React.FC<{ item: FeedItemData }> = ({ item }) => (
  <HStack spacing={4} p={4} borderWidth={1} borderRadius="lg" w="100%" bg="white" shadow="md">
    <Image boxSize="80px" src={item.image} alt={item.title} borderRadius="md" />
    <VStack align="start" spacing={2} flex="1">
      <Text fontWeight="bold">{item.title}</Text>
      <Text color="gray.600" noOfLines={2}>{item.description}</Text>
      <HStack>
        <Icon as={FaStar} color="yellow.400" />
        <Text>{item.rating}</Text>
      </HStack>
    </VStack>
  </HStack>
);

export default FeedItem;
