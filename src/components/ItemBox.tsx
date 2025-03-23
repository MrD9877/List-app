import React, { JSX } from "react";
import { Item } from "./List";
import useSwipe from "@/hooks/useSwipe";
import DeletePromt from "./DeletePromote";
import useTouchShow from "@/hooks/useTouchShow";
import { HoverCardDemo } from "./hoverCard";
import { useEffect } from "react";
import { useRef } from "react";
import { markItem } from "@/utility/ListItemsFn";
import { CircleCheck } from "lucide-react";
type DivComponentProps = JSX.IntrinsicElements["div"];
interface CodeCardProps extends DivComponentProps {
  data: Item;
  moveItems: boolean;
}

export default function ItemBox({ moveItems, data, ...props }: CodeCardProps) {
  const { onTouchEnd, onTouchMove, onTouchStart, swipe, setSwipe } = useSwipe();
  const { touchProps, isView } = useTouchShow();
  const timer = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (swipe === "right") {
      timer.current = setTimeout(() => {
        setSwipe(undefined);
        markItem(data);
      }, 600);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [swipe, setSwipe]);

  return (
    <div className="grid relative" {...touchProps}>
      <div
        className="rounded-lg "
        style={
          !moveItems
            ? {
                transitionProperty: "transform background-color",
                transitionDuration: "400ms",
                transform: swipe === "left" ? "translateX(-40px)" : swipe === undefined ? "translateX(0)" : "translateX(40px)",
                backgroundColor: data.read ? "#6f42c1" : "white",
              }
            : {}
        }
      >
        <div onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} className=" rounded-lg  text-black flex justify-center items-center row-span-1 select-none" {...props}>
          {data?.title}
          <div className="absolute justify-end flex w-full px-5">{data.read && <CircleCheck stroke="#28a745" width={16} />}</div>
        </div>
      </div>
      {!moveItems && (
        <div style={swipe === "left" ? { zIndex: 10 } : { zIndex: -10 }} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} className="row-span-1 absolute -z-10 flex justify-end w-full items-center px-2 h-full">
          <DeletePromt setSwipe={setSwipe} Itemkey={data.keyEntry} />
        </div>
      )}
      {isView && <HoverCardDemo data={data} />}
    </div>
  );
}
