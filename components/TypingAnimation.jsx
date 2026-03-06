import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useReducedMotion } from "../lib/useReducedMotion";

const DEFAULT_TEXTS = [
  "Welcome to my website!",
  "Feel free to look around.",
  "Thanks for stopping by!",
];

const TYPING_SPEEDS = [50, 35, 25];
const PAUSE_AFTER_TYPING = 2000;
const FADE_DURATION = 400;

// Phases: typing -> paused -> fading-out -> fading-in -> typing
const TypingAnimation = ({ messages }) => {
  const texts = messages || DEFAULT_TEXTS;
  const reducedMotion = useReducedMotion();

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | paused | fading-out | fading-in
  const [opacity, setOpacity] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);

  // Track messages prop changes to transition smoothly
  const pendingMessages = useRef(null);
  const currentTexts = useRef(texts);
  const prevMessagesRef = useRef(messages);

  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");

  // Detect messages prop change
  useEffect(() => {
    if (prevMessagesRef.current !== messages) {
      prevMessagesRef.current = messages;
      const newTexts = messages || DEFAULT_TEXTS;
      // If currently typing or paused, queue the new messages for after current cycle
      if (phase === "typing" || phase === "paused") {
        pendingMessages.current = newTexts;
      } else {
        // If in a fade transition, apply immediately since we're between messages
        currentTexts.current = newTexts;
        pendingMessages.current = null;
      }
    }
  }, [messages, phase]);

  // Apply pending messages at cycle boundary
  const applyPendingMessages = useCallback(() => {
    if (pendingMessages.current) {
      currentTexts.current = pendingMessages.current;
      pendingMessages.current = null;
      setTextIndex(0);
      setCycleCount(0);
      return true;
    }
    return false;
  }, []);

  // Get typing speed based on cycle count
  const getTypingSpeed = useCallback(() => {
    const idx = Math.min(cycleCount, TYPING_SPEEDS.length - 1);
    return TYPING_SPEEDS[idx];
  }, [cycleCount]);

  // Reduced motion: show full text, fade between messages
  useEffect(() => {
    if (!reducedMotion) return;

    const currentFullText = currentTexts.current[textIndex % currentTexts.current.length];
    setDisplayText(currentFullText);
    setOpacity(1);

    const timeout = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        applyPendingMessages();
        setTextIndex((prev) => (prev + 1) % currentTexts.current.length);
        setCycleCount((c) => c + 1);
        setOpacity(1);
      }, FADE_DURATION);
    }, PAUSE_AFTER_TYPING);

    return () => clearTimeout(timeout);
  }, [reducedMotion, textIndex, applyPendingMessages]);

  // Normal animation: phase-based state machine
  useEffect(() => {
    if (reducedMotion) return;

    const currentFullText = currentTexts.current[textIndex % currentTexts.current.length];

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
      const timeout = setTimeout(() => {
        setPhase("fading-out");
        setOpacity(0);
      }, PAUSE_AFTER_TYPING);
      return () => clearTimeout(timeout);
    } else if (phase === "fading-out") {
      const timeout = setTimeout(() => {
        // Apply pending messages if any, or advance index
        const applied = applyPendingMessages();
        if (!applied) {
          setTextIndex((prev) => (prev + 1) % currentTexts.current.length);
        }
        setCycleCount((c) => c + 1);
        setDisplayText("");
        setPhase("fading-in");
        setOpacity(1);
      }, FADE_DURATION);
      return () => clearTimeout(timeout);
    } else if (phase === "fading-in") {
      // Small delay then start typing
      const timeout = setTimeout(() => {
        setPhase("typing");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [reducedMotion, phase, displayText, textIndex, getTypingSpeed, applyPendingMessages]);

  const currentFullText = currentTexts.current[textIndex % currentTexts.current.length];

  return (
    <Box
      role="status"
      aria-live="polite"
      display="inline-block"
      border="1px solid"
      borderColor={borderColor}
      borderRadius={17}
      px={{ base: 3, md: 4 }}
      py={2}
      mt={3}
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
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="400"
        letterSpacing="0.01em"
        aria-hidden="true"
        style={{
          opacity,
          transition: `opacity ${FADE_DURATION}ms ease`,
        }}
      >
        {displayText}
        {!reducedMotion && (
          <Box
            as="span"
            aria-hidden="true"
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
        )}
      </Text>
    </Box>
  );
};

export default TypingAnimation;
