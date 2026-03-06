import { useState, useEffect } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const DEFAULT_TEXTS = [
  "Welcome to my website!",
  "Feel free to look around.",
  "Thanks for stopping by!",
];

const TYPING_SPEED = 50;
const DELETING_SPEED = 30;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_AFTER_DELETING = 500;

const TypingAnimation = ({ messages }) => {
  const texts = messages || DEFAULT_TEXTS;
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");

  useEffect(() => {
    const currentFullText = texts[textIndex % texts.length];

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause then start deleting
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, PAUSE_AFTER_TYPING);
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, DELETING_SPEED);
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, pause then move to next text
        const timeout = setTimeout(() => {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % (texts.length || 1));
        }, PAUSE_AFTER_DELETING);
        return () => clearTimeout(timeout);
      }
    }
  }, [displayText, isDeleting, textIndex, texts]);

  return (
    <Box
      display="inline-block"
      border="1px solid"
      borderColor={borderColor}
      borderRadius={17}
      px={{ base: 3, md: 4 }}
      py={2}
      mt={3}
    >
      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="400" letterSpacing="0.01em">
        {displayText}
        <Box
          as="span"
          display="inline-block"
          w="1px"
          h="1em"
          bg="currentColor"
          ml="2px"
          verticalAlign="text-bottom"
          animation="blink 1s step-end infinite"
          sx={{
            "@keyframes blink": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0 },
            },
          }}
        />
      </Text>
    </Box>
  );
};

export default TypingAnimation;
