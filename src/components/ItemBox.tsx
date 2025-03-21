import React, { JSX } from "react";
import { Item } from "./List";
import useSwipe from "@/hooks/useSwipe";
import { Trash2Icon } from "lucide-react";
import DeletePromt from "./DeletePromote";
type DivComponentProps = JSX.IntrinsicElements["div"];
interface CodeCardProps extends DivComponentProps {
  data: Item;
  moveItems: boolean;
}

export default function ItemBox({ moveItems, data, ...props }: CodeCardProps) {
  const { onTouchEnd, onTouchMove, onTouchStart, swipe, setSwipe } = useSwipe();
  return (
    <div className="grid relative">
      <div style={!moveItems ? { transition: "transform 400ms ", transform: swipe === "left" ? "translateX(-40px)" : "translateX(0)" } : {}}>
        <div onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} className=" rounded-lg  bg-white text-black flex justify-center items-center row-span-1" {...props}>
          {data?.title}
        </div>
      </div>
      {!moveItems && (
        <div style={swipe === "left" ? { zIndex: 10 } : { zIndex: -10 }} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove} onTouchStart={onTouchStart} className="row-span-1 absolute -z-10 flex justify-end w-full items-center px-2 h-full">
          <DeletePromt setSwipe={setSwipe} Itemkey={data.keyEntry}>
            <Trash2Icon stroke="red" onClick={() => console.log("clicked")} />
          </DeletePromt>
        </div>
      )}
    </div>
  );
}
