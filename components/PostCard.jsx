import React from 'react';
import moment from 'moment';
import Link from 'next/link';

const PostCard = ({ post }) => {
  return (
    <div className='pt-3 pb-3'>
      <div className='mb-0.5'>
        <span>
          {moment(post.createdAt).format('MMM DD YYYY')}
        </span>
      </div>
      <h1 className='text-2xl text-myblue'>
        <Link href={`/post/${post.slug}`}>
          {post.title}
        </Link>
      </h1>
    </div>
  )
}

export default PostCard