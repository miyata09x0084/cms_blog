// components/WavingImage.jsx
import React, { useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { Image } from '@chakra-ui/react';

const WavingImage = ({
  src,
  alt,
  intensity = 0.1,
  duration = 8000,
  ...props
}) => {
  const calc = (x, y) => [
    -(y - window.innerHeight / 2) * intensity,
    (x - window.innerWidth / 2) * intensity,
    1.1,
  ];
  const trans = (x, y, s) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const [springProps, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  // Add subtle rotation effect when the component is mounted
  useEffect(() => {
    set({ xys: [0, 0, 1.05] });
  }, []);

  return (
    <animated.div
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{
        transform: springProps.xys.interpolate(trans),
      }}
    >
      <Image src={src} alt={alt} {...props} />
    </animated.div>
  );
};

export default WavingImage;
