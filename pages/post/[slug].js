import React from 'react';
import { useRouter } from 'next/router'
import { getPosts, getPostDetails } from '../../services';
import { PostDetail, Loader } from '../../components';

const PostDetails = ({ post }) => {
  const router =  useRouter();

  if(router.isFallback) {
    return <Loader />
  }
  return (
    <div className='container mx-auto'>
        <PostDetail post={post} />
    </div>
  )
}

export default PostDetails

export async function getStaticProps({ params }) {
    const data = await getPostDetails(params.slug)
    return {
      props: { post: data }
    }
}

export async function getStaticPaths() {
    const posts = await getPosts();
    return {
        paths: posts.map(({node: { slug }}) => ({params: {slug}})),
        fallback: false,
    }
}