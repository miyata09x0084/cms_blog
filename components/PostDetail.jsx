import React from 'react';
import moment from 'moment';
import { Box, Heading, VStack, useColorModeValue } from '@chakra-ui/react';

const PostDetail = ({ post }) => {

  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");

  const getContentFragment = (index, text, obj, type) => {
    let modifiedText = text;

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
    <Box className="fade-in" w="100%" h="100vh">
      <VStack align="start" maxW="768px" mx="auto" px={{ base: "4", md: "0" }} pt="40px">
        <Box pt="12px" pb="3px" w="100%">
          <Heading as="h1" size="md" pb={1} mb={1} borderBottom="1px solid" borderColor={borderColor}>
            {post.title}
          </Heading>
          <VStack align="start" mb="4px">
            <Box color={textSecondary}>
              {moment(post.createdAt).format('MMM DD YYYY')}
            </Box>
          </VStack>
          {post.content.raw.children.map((typeObj, index) => {
            const children = typeObj.children.map((item, itemIndex) => getContentFragment(itemIndex, item.text, item))
            return getContentFragment(index, children, typeObj, typeObj.type)
          })}
        </Box>
      </VStack>
    </Box>
  )
}

export default PostDetail
