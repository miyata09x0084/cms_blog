import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

const ZoomInFocusImage = ({ src, alt, ...rest }) => {
  return (
    <MotionBox
      initial={{ scale: 1, filter: 'blur(0px)' }}
      whileHover={{ scale: 1.1, filter: 'blur(5px)' }}
      transition={{ duration: 0.5 }}
      {...rest}
    />
  );
};

export default ZoomInFocusImage;
