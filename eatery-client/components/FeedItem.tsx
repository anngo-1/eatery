// components/FeedItem.tsx
import React from 'react';
import { HStack, VStack, Text, Icon, Image, Link, Spacer } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

export interface FeedItemData {
  id: number;
  name: string;
  description: string;
  address: string; 
  price: string;
  image: string;
  website: string;  
  rating: number;
}

const FeedItem: React.FC<{ item: FeedItemData }> = ({ item }) => (
  <HStack spacing={4} p={4} borderWidth={1} borderRadius="lg" w="100%" bg="white" shadow="md">
    {/* Image of the feed item */}
    <Image boxSize="80px" src={item.image} alt={item.name} borderRadius="md" />

    {/* Information Stack */}
    <VStack align="start" spacing={2} flex="1">
      {/* Name */}
      <Text fontWeight="bold" fontSize="lg">{item.name}</Text>

      {/* Description */}
      <Text color="gray.600" noOfLines={2}>{item.description}</Text>

      {/* Address */}
      <Text fontSize="sm" color="gray.500">{item.address}</Text>

      {/* Price */}
      <Text fontSize="sm" color="gray.500" fontWeight="semibold">{item.price}</Text>

      {/* Website Link */}
      <Link href={item.website} color="blue.500" isExternal fontSize="sm">
        Visit Website
      </Link>

      {/* Rating */}
      <HStack>
        <Icon as={FaStar} color="yellow.400" />
        <Text>{item.rating}</Text>
      </HStack>
    </VStack>

    <Spacer />
  </HStack>
);

export default FeedItem;
