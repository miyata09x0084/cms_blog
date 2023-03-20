import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { useTheme } from 'styled-components';
import { Box, Heading } from '@chakra-ui/react';

const PostCard = ({ post }) => {
  const theme = useTheme()
  return (
    <Box className='pt-3 pb-3'>
      <Box className='mb-0.5'>
        <span style = {{color: theme.day}}>
          {moment(post.createdAt).format('MMM DD YYYY')}
        </span>
      </Box>
      <Heading size="md">
        <Link style = {{color: theme.title}} href={`/post/${post.slug}`}>
          {post.title}
        </Link>
      </Heading>
    </Box>
  )
}

export default PostCard