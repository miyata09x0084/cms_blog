import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useReducedMotion } from "../lib/useReducedMotion";

const TYPING_SPEEDS = [110, 85, 65];
const PAUSE_AFTER_TYPING = 3500;
const FADE_DURATION = 500;
const TYPING_JITTER = 0.4;
const FADE_IN_DELAY = 300;

const INTRO_MESSAGE = "Hi, I'm Full Stack Developer based in Japan.";

// Phases: typing -> paused -> fading-out -> fading-in -> typing
const TypingAnimation = () => {
  const texts = useRef([INTRO_MESSAGE]);
  const reducedMotion = useReducedMotion();

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | paused | fading-out | fading-in
  const [opacity, setOpacity] = useState(1);
  const [stopped, setStopped] = useState(false);

  const totalMessagesShown = useRef(0);

  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");

  // Get typing speed based on totalMessagesShown tier
  const getTypingSpeed = useCallback(() => {
    const tier = Math.floor(totalMessagesShown.current / 2);
    const idx = Math.min(tier, TYPING_SPEEDS.length - 1);
    const base = TYPING_SPEEDS[idx];
    const jitter = 1 + (Math.random() * 2 - 1) * TYPING_JITTER;
    return Math.round(base * jitter);
  }, []);

  // Reduced motion: show full text, fade between messages
  useEffect(() => {
    if (!reducedMotion || stopped) return;

    const currentFullText = texts.current[textIndex % texts.current.length];
    setDisplayText(currentFullText);
    setOpacity(1);

    const timeout = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        totalMessagesShown.current += 1;
        if (totalMessagesShown.current >= texts.current.length) {
          setStopped(true);
          setOpacity(1);
          return;
        }
        setTextIndex((prev) => (prev + 1) % texts.current.length);
        setOpacity(1);
      }, FADE_DURATION);
    }, PAUSE_AFTER_TYPING);

    return () => clearTimeout(timeout);
  }, [reducedMotion, textIndex, stopped]);

  // Normal animation: phase-based state machine
  useEffect(() => {
    if (reducedMotion || stopped) return;

    const currentFullText = texts.current[textIndex % texts.current.length];

    if (phase === "typing") {
      if (displayText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, getTypingSpeed());
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, move to paused
        setPhase("paused");
      }
    } else if (phase === "paused") {
      // Check stop condition before scheduling next transition
      totalMessagesShown.current += 1;
      if (totalMessagesShown.current >= texts.current.length) {
        setStopped(true);
        return;
      }
      const timeout = setTimeout(() => {
        setPhase("fading-out");
        setOpacity(0);
      }, PAUSE_AFTER_TYPING);
      return () => clearTimeout(timeout);
    } else if (phase === "fading-out") {
      const timeout = setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % texts.current.length);
        setDisplayText("");
        setPhase("fading-in");
        setOpacity(1);
      }, FADE_DURATION);
      return () => clearTimeout(timeout);
    } else if (phase === "fading-in") {
      // Small delay then start typing
      const timeout = setTimeout(() => {
        setPhase("typing");
      }, FADE_IN_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [reducedMotion, phase, displayText, textIndex, getTypingSpeed, stopped]);

  const currentFullText = texts.current[textIndex % texts.current.length];

  return (
    <Box
      role="status"
      aria-live="polite"
      display="flex"
      justifyContent="center"
      w="100%"
      mb={{ base: 5, md: 6 }}
    >
      <Box
        display="inline-flex"
        alignItems="center"
        border="1px solid"
        borderColor={borderColor}
        borderRadius={20}
        px={{ base: 5, md: 8 }}
        py={{ base: 4, md: 5 }}
        minH={{ base: "60px", md: "72px" }}
      >
        {/* Visually hidden full text for screen readers */}
        <Box
          as="span"
          position="absolute"
          width="1px"
          height="1px"
          overflow="hidden"
          clipPath="inset(50%)"
        >
          {currentFullText}
        </Box>

        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="400"
          letterSpacing="0.01em"
          aria-hidden="true"
        >
          <Box
            as="span"
            style={{
              opacity,
              transition: `opacity ${FADE_DURATION}ms ease`,
            }}
          >
            {displayText}
            <Box
              as="span"
              aria-hidden="true"
              display="inline-block"
              w="2px"
              h="1em"
              bg="currentColor"
              ml="2px"
              verticalAlign="text-bottom"
              visibility={!reducedMotion && !stopped ? "visible" : "hidden"}
              animation={!reducedMotion && !stopped ? "blink 1s step-end infinite" : "none"}
              sx={{
                "@keyframes blink": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0 },
                },
              }}
            />
          </Box>
          <Box as="span" visibility="hidden" aria-hidden="true">
            {currentFullText.slice(displayText.length)}
          </Box>
        </Text>
      </Box>
    </Box>
  );
};

export default TypingAnimation;
