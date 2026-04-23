import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, AnimatePresence } from "motion/react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [hasMoved, setHasMoved] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    // Check if device is touch-only
    const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouchDevice(mediaQuery.matches);

    const checkTouch = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    mediaQuery.addEventListener("change", checkTouch);
    return () => mediaQuery.removeEventListener("change", checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) {
      document.body.style.cursor = "auto";
      return;
    }

    // Apply cursor none to body only for non-touch devices
    document.body.style.cursor = "none";

    const moveCursor = (e: MouseEvent) => {
      if (!hasMoved) setHasMoved(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, input, textarea, [role="button"], [data-cursor]');
      
      if (interactiveEl) {
        setIsHovering(true);
        const cursorEl = interactiveEl.closest('[data-cursor]');
        if (cursorEl) {
          const cursorData = cursorEl.getAttribute('data-cursor');
          if (cursorData === 'view') {
            setHoverText("View Project");
          } else if (cursorData === 'click') {
            setHoverText("Click");
          } else {
            setHoverText("");
          }
        } else {
          setHoverText("");
        }
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
    };
  }, [cursorX, cursorY, hasMoved, isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  const cursorColor = "#000000"; // Changed to Black
  const textColor = "#FFFFFF"; // Changed to White for contrast

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex flex-col items-start"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: hasMoved ? 1 : 0,
      }}
    >
      {/* Figma Pointer SVG - Medium Size */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
        style={{ transform: 'translate(-2px, -2px)' }}
      >
        <path
          d="M2 2L11.4 28.3C11.6 28.9 12.5 28.9 12.7 28.3L15.4 18.6C15.5 18.2 15.8 17.9 16.2 17.8L25.9 15.1C26.5 14.9 26.5 14 25.9 13.8L2 2Z"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>

      {/* Figma Name Tag / Hover Text */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md ml-4 mt-0"
            style={{ backgroundColor: cursorColor, color: textColor }}
          >
            {hoverText || "Click"}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
