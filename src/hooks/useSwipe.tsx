import { useState } from "react";

export default function useSwipe() {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipe, setSwipe] = useState<"left" | "right">();

  const minSwipeDistance = 50;

  const getClientX = (e: React.TouchEvent | React.MouseEvent): number => {
    if ("touches" in e && e.touches.length > 0) {
      return e.touches[0].clientX;
    } else if ("changedTouches" in e && e.changedTouches.length > 0) {
      return e.changedTouches[0].clientX;
    } else {
      return (e as React.MouseEvent).clientX;
    }
  };

  const onStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(getClientX(e));
  };

  const onMove = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(getClientX(e));
  };

  const onEnd = () => {
    if (!touchStart || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      const newDirection = isLeftSwipe ? "left" : "right";
      if ((newDirection === "left" && swipe === "right") || (newDirection === "right" && swipe === "left")) {
        setSwipe(undefined);
      } else {
        setSwipe(newDirection);
      }
    }
    console.log("Swipe detected:", isLeftSwipe ? "left" : isRightSwipe ? "right" : "none");
  };

  return {
    onTouchStart: onStart,
    onTouchMove: onMove,
    onTouchEnd: onEnd,
    swipe,
    setSwipe,
  } as const;
}
