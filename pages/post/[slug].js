import React from 'react';
import Head from 'next/head';
import { getPosts, getPostDetails } from '../../services';
import { PostDetail } from '../../components';

const PostDetails = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title} — Ryo Miyata</title>
      </Head>
      <PostDetail post={post} />
    </>
  );
};

export default PostDetails;

export async function getStaticProps({ params }) {
  const data = await getPostDetails(params.slug);
  return { props: { post: data } };
}

export async function getStaticPaths() {
  const posts = await getPosts();
  return {
    paths: posts.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: false,
  };
}