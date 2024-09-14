'use client'
import React from 'react';
import { Box, Image, Text, VStack, HStack, Icon, Button, Divider } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
// types.ts (or you can include this in your component file)

export interface FeedItemType {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
}

export type FeedDataType = FeedItemType[];

interface FeedItemProps {
  item: FeedItemType;
}

const FeedItem: React.FC<FeedItemProps> = ({ item }) => (
  <HStack
    spacing={4}
    p={4}
    borderWidth={1}
    borderRadius="md"
    borderColor="gray.200"
    bg="white"
    shadow="md"
    w="100%"
  >
    <Image
      boxSize="100px"
      objectFit="cover"
      borderRadius="md"
      src={item.image}
      alt={item.title}
    />
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

interface FeedProps {
  feedData: FeedDataType;
}

const Feed: React.FC<FeedProps> = ({ feedData }) => (
  <Box p={4}>
    {feedData.map(item => (
      <React.Fragment key={item.id}>
        <FeedItem item={item} />
        <Divider my={4} />
      </React.Fragment>
    ))}
  </Box>
);

export default Feed;

