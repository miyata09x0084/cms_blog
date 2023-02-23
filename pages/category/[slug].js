import React from 'react'
import { useRouter } from 'next/router';
import { getCategories, getCategoryPost } from '../../services';
import { PostCard, Loader, Categories } from '../../components';

const CategoryPost = ({ posts }) => {
  const router = useRouter();
  console.log(posts)

  if (router.isFallback) {
    return <Loader />
  }

  return (
    <div className='container mx-auto lg:px-96'>
        <div className='text-center pt-8 pb-8 border-b border-t border-gray-300 mt-8 mb-12'>
            <Categories />
        </div>
        {posts.map((post, index) => (
            <PostCard key={index} post={post.node} />
        ))}
    </div>
  )
}

export default CategoryPost

export async function getStaticProps({ params }) {
    const posts = await getCategoryPost(params.slug);
    return {
        props: { posts },
    };
}

export async function getStaticPaths() {
    const categories = await getCategories();
    return {
        paths: categories.map(({ slug }) => ({params: { slug }})),
        fallback: true,
    };
}