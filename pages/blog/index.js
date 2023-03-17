import React from 'react'
import { getPosts } from '../../services'
import { Categories, PostCard } from '../../components'

const BlogIndex = ({posts}) => {
  return (
    <div className="mx-auto max-w-screen-md @screen px-8 md:px-0 mb-8 font-MplusRounded">
        <div className='text-center pt-8 pb-8 border-b border-t border-gray-300 mt-8 mb-12'>
            <Categories />
        </div>
        <div>
            {posts.map((post) => (<PostCard post={post.node} key={post.title} />))}
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

export default BlogIndex