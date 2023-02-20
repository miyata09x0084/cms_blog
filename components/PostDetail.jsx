import React from 'react';
import moment from 'moment';
import Link from 'next/link';

const PostDetail = ({ post }) => {

  const getContentFragment = (index, text, obj, type) => {
    let modifiedText = text;

    if (obj) {
      if (obj.bold) {
        modifiedText = (<b key={index}>{text}</b>);
      }

      if (obj.italic) {
        modifiedText = (<em key={index}>{text}</em>);
      }

      if (obj.underline) {
        modifiedText = (<u key={index}>{text}</u>);
      }
    }

    switch (type) {
      case 'heading-three':
        return <h3 key={index} className="text-xl font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
      case 'paragraph':
        return <p key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>;
      case 'heading-four':
        return <h4 key={index} className="text-md font-semibold mb-4">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
      case 'image':
        return (
          <div className='flex justify-center'>
            <img
              alt={obj.title}
              height={obj.height}
              width={obj.width}
              src={obj.src}
              />
          </div>
        );
      default:
        return modifiedText;
    }
  };

  return (
    <div>
        <div className='pt-12 pb-3'>
          <h1 className='text-2xl pb-1 mb-1 border-b border-gray-300'>
              {post.title}
          </h1>
          <div className='mb-12'>
            <span>
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