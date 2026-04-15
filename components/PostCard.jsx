import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { Box, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';

const PostCard = ({ post }) => {
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");

  return (
    <Link href={`/post/${post.slug}`} style={{ width: '100%' }}>
      <VStack
        align="start"
        spacing={2}
        w="100%"
        pb={5}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Text fontSize="sm" color={textSecondary}>
          {moment(post.createdAt).format('MMM DD, YYYY')}
        </Text>
        <Heading as="h2" size="md">
          {post.title}
        </Heading>
      </VStack>
    </Link>
  )
}

export default PostCard
