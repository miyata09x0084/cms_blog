import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { useTheme } from 'styled-components';

const PostCard = ({ post }) => {
  const theme = useTheme()
  return (
    <div className='pt-3 pb-3'>
      <div className='mb-0.5'>
        <span style = {{color: theme.day}}>
          {moment(post.createdAt).format('MMM DD YYYY')}
        </span>
      </div>
      <h1 className='text-2xl text-myblue'>
        <Link style = {{color: theme.title}} href={`/post/${post.slug}`}>
          {post.title}
        </Link>
      </h1>
    </div>
  )
}

export default PostCard