import { useState, useEffect, useRef, useCallback } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCat,
  faPaw,
  faHeart,
  faFish,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useReducedMotion } from "../lib/useReducedMotion";

const MAX_FLOATS = 5;
const IDLE_START_DELAY = 6000;
const IDLE_INTERVAL_MIN = 12000;
const IDLE_INTERVAL_MAX = 15000;
const CLICK_RESET_DELAY = 30000;

const REACTIONS = [
  // click 1: small bounce
  { animClass: "cat-bounce", floats: [] },
  // click 2
  { animClass: "cat-bounce-big", floats: [{ text: "Meow", icon: null }] },
  // click 3
  { animClass: "cat-bounce-big", floats: [{ text: "Meow", icon: null }] },
  // click 4
  { animClass: "cat-spin", floats: [{ text: "Meow!", icon: null }, { text: null, icon: faPaw }] },
  // click 5
  { animClass: "cat-spin", floats: [{ text: null, icon: faPaw }, { text: null, icon: faPaw }] },
  // click 6
  { animClass: "cat-wiggle", floats: [{ text: null, icon: faHeart }] },
  // click 7
  { animClass: "cat-wiggle", floats: [{ text: null, icon: faHeart }, { text: null, icon: faHeart }] },
  // click 8
  { animClass: "cat-purr", floats: [{ text: "Purr...", icon: null }, { text: null, icon: faFish }] },
  // click 9
  { animClass: "cat-purr", floats: [{ text: null, icon: faFish }, { text: null, icon: faFish }] },
];

let floatIdCounter = 0;

const CatLogo = () => {
  const [clickCount, setClickCount] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const [floatingElements, setFloatingElements] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  const idleTimerRef = useRef(null);
  const idleIntervalRef = useRef(null);
  const clickResetTimerRef = useRef(null);

  const reducedMotion = useReducedMotion();
  const color = useColorModeValue("var(--text)", "var(--dark-text)");
  const floatColor = useColorModeValue("var(--accent)", "var(--dark-accent)");

  // Clear all idle timers
  const clearIdleTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current);
      idleIntervalRef.current = null;
    }
    setIsIdle(false);
  }, []);

  // Start idle cycle
  const startIdleCycle = useCallback(() => {
    if (reducedMotion) return;
    clearIdleTimers();

    idleTimerRef.current = setTimeout(() => {
      // First twitch
      setIsIdle(true);

      // Subsequent twitches at random intervals
      const scheduleNext = () => {
        const delay =
          IDLE_INTERVAL_MIN +
          Math.random() * (IDLE_INTERVAL_MAX - IDLE_INTERVAL_MIN);
        idleIntervalRef.current = setTimeout(() => {
          setIsIdle(true);
          scheduleNext();
        }, delay);
      };
      scheduleNext();
    }, IDLE_START_DELAY);
  }, [reducedMotion, clearIdleTimers]);

  // Reset idle on any interaction
  const resetIdle = useCallback(() => {
    clearIdleTimers();
    startIdleCycle();
  }, [clearIdleTimers, startIdleCycle]);

  // Start idle on mount
  useEffect(() => {
    startIdleCycle();
    return clearIdleTimers;
  }, [startIdleCycle, clearIdleTimers]);

  // Add floating elements (capped at MAX_FLOATS)
  const addFloats = useCallback(
    (floats) => {
      if (reducedMotion || floats.length === 0) return;

      const newElements = floats.map((f) => ({
        id: ++floatIdCounter,
        text: f.text,
        icon: f.icon,
        x: (Math.random() - 0.5) * 30,
      }));

      setFloatingElements((prev) => {
        const combined = [...prev, ...newElements];
        return combined.slice(-MAX_FLOATS);
      });
    },
    [reducedMotion]
  );

  // Remove a floating element after animation
  const removeFloat = useCallback((id) => {
    setFloatingElements((prev) => prev.filter((el) => el.id !== id));
  }, []);

  // Handle click
  const handleClick = useCallback(() => {
    resetIdle();

    const newCount = clickCount + 1;

    // Reset click reset timer
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
    }
    clickResetTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, CLICK_RESET_DELAY);

    if (newCount >= 10) {
      // Party mode
      setAnimClass("");
      requestAnimationFrame(() => setAnimClass("cat-party"));
      addFloats([
        { text: null, icon: faStar },
        { text: null, icon: faStar },
        { text: null, icon: faHeart },
      ]);
      setClickCount(0);
      return;
    }

    const reactionIndex = Math.min(newCount - 1, REACTIONS.length - 1);
    const reaction = REACTIONS[reactionIndex];

    // Reset animClass to re-trigger animation
    setAnimClass("");
    requestAnimationFrame(() => setAnimClass(reaction.animClass));
    addFloats(reaction.floats);
    setClickCount(newCount);
  }, [clickCount, resetIdle, addFloats]);

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    resetIdle();
  }, [resetIdle]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    resetIdle();
  }, [resetIdle]);

  // Keyboard support
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // Determine current CSS class for the icon
  const getIconClass = () => {
    if (animClass) return animClass;
    if (isHovered && !reducedMotion) return "cat-curious";
    if (isIdle && !reducedMotion) return "cat-idle-twitch";
    return "";
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    };
  }, []);

  // Clear animClass after animation ends (except purr which loops)
  const handleAnimationEnd = useCallback(() => {
    if (animClass && animClass !== "cat-purr") {
      setAnimClass("");
    }
    if (isIdle) {
      setIsIdle(false);
    }
  }, [animClass, isIdle]);

  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <Link href="/" passHref>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          cursor="pointer"
          aria-label="Home"
          role="link"
          tabIndex={0}
          color={color}
        >
          <Box
            as="span"
            display="inline-block"
            className={getIconClass()}
            onAnimationEnd={handleAnimationEnd}
          >
            <FontAwesomeIcon width={26} height={26} icon={faCat} />
          </Box>
        </Box>
      </Link>

      {/* Floating elements */}
      <AnimatePresence>
        {floatingElements.map((el) => (
          <motion.span
            key={el.id}
            initial={{ opacity: 1, y: 0, x: el.x }}
            animate={{ opacity: 0, y: -30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => removeFloat(el.id)}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -4,
              left: "50%",
              pointerEvents: "none",
              fontSize: "12px",
              color: floatColor,
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            {el.text ? (
              el.text
            ) : el.icon ? (
              <FontAwesomeIcon icon={el.icon} style={{ width: 10, height: 10 }} />
            ) : null}
          </motion.span>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default CatLogo;
