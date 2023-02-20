import type { NextPage } from 'next'
import Head from 'next/head'
import { PostCard, Categories, Header } from '../components';
import { getPosts } from '../services';
import { request, gql } from 'graphql-request';

const Home: NextPage = ({ posts }) => {
  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>CMS Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=''>
        <div className='text-center pt-12 pb-12 border-b border-t border-gray-300 mt-12 mb-12'>
              <Categories />
        </div>
        <div className=''>
          {posts.map((post) => (<PostCard post={post.node} key={post.title} />))}
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts }
  }
}

export default Home;