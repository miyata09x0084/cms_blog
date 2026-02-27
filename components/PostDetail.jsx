import React from 'react';
import moment from 'moment';
import { Box, Heading, VStack, Text, useColorModeValue } from '@chakra-ui/react';

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
    <Box className="fade-in" w="100%" minH="100vh">
      <VStack align="start" maxW="720px" mx="auto" px={{ base: "5", md: "0" }} pt={12} pb={16}>
          <Box w="100%">
            <Text fontSize="sm" color={textSecondary} mb={2}>
              {moment(post.createdAt).format('MMM DD, YYYY')}
            </Text>
            <Heading as="h1" fontSize="2xl" fontWeight="700" letterSpacing="-0.02em" mb={8} pb={4} borderBottom="1px solid" borderColor={borderColor}>
              {post.title}
            </Heading>
            <Box fontSize="15px" lineHeight="1.9" letterSpacing="0.01em">
              {post.content.raw.children.map((typeObj, index) => {
                const children = typeObj.children.map((item, itemIndex) => getContentFragment(itemIndex, item.text, item))
                return getContentFragment(index, children, typeObj, typeObj.type)
              })}
            </Box>
          </Box>
      </VStack>
    </Box>
  )
}

export default PostDetail
