import { useRef } from "react";
import { useState } from "react";

export default function useTouchShow() {
  const [isView, setView] = useState(false);
  const timer = useRef<NodeJS.Timeout>(null);

  function onTouchStart() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setView(true);
    }, 400);
  }
  function onTouchEnd() {
    setView(false);
    if (timer.current) clearTimeout(timer.current);
  }
  return { touchProps: { onTouchStart, onTouchEnd }, isView } as const;
}
