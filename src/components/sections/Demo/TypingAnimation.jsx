import { useEffect, useState } from "react";

export default function TypingAnimation({
  text,
  speed = 60,
  delay = 0,
  className = "",
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText("");

    let interval;

    const timeout = setTimeout(() => {
      let index = 0;

      interval = setInterval(() => {
        index++;

        setDisplayText(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(interval);
        }
      }, speed);

    }, delay);

    return () => {
      clearTimeout(timeout);

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayText}

      {displayText.length !== text.length && (
        <span
          className="
            ml-1

            animate-pulse

            font-bold

            text-blue-600
          "
        >
          |
        </span>
      )}
    </span>
  );
}