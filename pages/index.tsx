import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { PostCard, Categories} from '../components';
import { getPosts } from '../services';

interface HomeProps {
  posts: any[]; // ここで適切な型を指定する
}

const Home: NextPage = ({ posts }) => {

  return (
      <div className="mx-auto max-w-screen-md @screen px-8 md:px-0 mb-8">
        <Head>
          <title>CMS Blog</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
            <div className='text-center pt-8 pb-8 border-b border-t border-gray-300 mt-8 mb-12'>
                  <Categories />
            </div>
            {posts.map((post) => (<PostCard post={post.node} key={post.title} />))}
      </div>
  )
}

// export async function getStaticProps() {
//   const posts = (await getPosts()) || [];

//   return {
//     props: { posts }
//   }
// }

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = (await getPosts()) || [];

  return {
    props: { posts }
  }
}

export default Home;