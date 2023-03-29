import React from 'react';
import moment from 'moment';
import { useTheme } from 'styled-components';
import { Box, Heading,VStack, useColorMode, useColorModeValue } from '@chakra-ui/react';

const PostDetail = ({ post }) => {
  const theme = useTheme()
  // {console.log(post)}

  const { colorMode } = useColorMode();
  const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");
  const colorSub = useColorModeValue("var(--secondary-text)", "var(--dark-bg)");

  const getContentFragment = (index, text, obj, type) => {
    let modifiedText = text;

    // {console.log(index, text, obj, type)}

    if (obj) {
      if (obj.bold) {
        modifiedText = (<b key={index}>{text}</b>);
      }

      if (obj.italic) {
        modifiedText = (<em className='flex justify-center mt-2 mb-16' key={index}>{text}</em>);
      }

      if (obj.underline) {
        modifiedText = (<u key={index}>{text}</u>);
      }
    }

    switch (type) {
      case 'heading-three':
        return <h3 key={index} className="text-xl mb-2 pb-2 border-b">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h3>;
      case 'paragraph':
        return <p key={index} className="mb-8">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</p>;
      case 'heading-four':
        return <h4 key={index} className="text-md mb-2 pb-2 border-b">{modifiedText.map((item, i) => <React.Fragment key={i}>{item}</React.Fragment>)}</h4>;
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
    <Box w="100%" h="100vh" bg={bg} >
      <VStack align="start" maxW="600px" h="100%" mx="auto" px={{ base: "8", md: "0" }} color={color} pt="40px">
          <Box pt="12px" pb="3px">
            <Heading as="h1" size="md" className='pb-1 mb-1 border-b border-gray-300'>
              {post.title}
            </Heading>
            <VStack align="start" mb="4px">
              <Box>
                {moment(post.createdAt).format('MMM DD YYYY')}
              </Box>
            </VStack>
            {post.content.raw.children.map((typeObj, index) => {
              const children =typeObj.children.map((item, itemIndex) => getContentFragment(itemIndex, item.text, item))
              return getContentFragment(index, children, typeObj, typeObj.type)
            })}
          </Box>
      </VStack>
    </Box>
  )
}

export default PostDetail