import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { useTheme } from 'styled-components';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const PostCard = ({ post }) => {
  const theme = useTheme()
  return (
    <VStack align="start" pb="20px">
      <Text style = {{color: theme.day}} borderBottom="1px solid lightgray" pb="6px">
        {moment(post.createdAt).format('MMM DD YYYY')}
      </Text>
      <Heading as="h1" size="md">
        <Link style = {{color: theme.title}} href={`/post/${post.slug}`}>
          {post.title}
        </Link>
      </Heading>
    </VStack>
  )
}

export default PostCard