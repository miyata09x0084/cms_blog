import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { useTheme } from 'styled-components';

const PostDetail = ({ post }) => {
  const theme = useTheme()

  // {console.log(post)}

  const getContentFragment = (index, text, obj, type) => {
    let modifiedText = text;

    // {console.log(index, text, obj, type)}

    if (obj) {
      if (obj.bold) {
        modifiedText = (<b key={index}>{text}</b>);
      }

      if (obj.italic) {
        modifiedText = (<em style = {{color: theme.article}} className='flex justify-center mt-2 mb-16' key={index}>{text}</em>);
      }

      if (obj.underline) {
        modifiedText = (<u key={index}>{text}</u>);
      }
    }

    switch (type) {
      case 'heading-three':
        return <h3 key={index} style = {{color: theme.article}} className="text-xl mb-2 pb-2 border-b">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
      case 'paragraph':
        return <p key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>;
      case 'heading-four':
        return <h4 key={index} style = {{color: theme.article}} className="text-md mb-2 pb-2 border-b">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
      case 'image':
        return (
          <div className='flex justify-center mt-20'>
            <img
              alt={obj.title}
              height={obj.height}
              width={obj.width}
              src={obj.src}
              />
          </div>
        );
      case 'code-block':
          return <div className="mb-8" key={index} dangerouslySetInnerHTML={{__html: modifiedText}}></div>;
      default:
        return modifiedText;
    }
  };

  return (
    <div>
        <div className='pt-12 pb-3 xl:px-96'>
          <h1 style = {{color: theme.article}} className='text-2xl pb-1 mb-1 border-b border-gray-300'>
              {post.title}
          </h1>
          <div className='mb-4'>
            <span style = {{color: theme.article}}>
              {moment(post.createdAt).format('MMM DD YYYY')}
            </span>
          </div>
          {post.content.raw.children.map((typeObj, index) => {
            const children =typeObj.children.map((item, itemIndex) => getContentFragment(itemIndex, item.text, item))
            return getContentFragment(index, children, typeObj, typeObj.type)
          })}
        </div>
    </div>
  )
}

export default PostDetail