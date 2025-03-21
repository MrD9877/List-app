import { AnimationList, Direction, Item } from "@/components/List";
import { moveItemInList } from "@/utility/ListItemsFn";
import React from "react";
import { useRef } from "react";
import { useState } from "react";

const speed = 0.5;

function animationStyle(time: number, direction: Direction, delay = 0) {
  const style: React.CSSProperties = {
    animation: `${direction} ${time * speed}s linear 1 forwards ${delay * speed}s`,
    height: "var(--height)",
  };
  return style;
}
function setBlocksMove(direction: Direction, blocks: number) {
  const property = direction === "moveUp" ? "--blocksUp" : "--blocksDown";
  const reset = direction === "moveUp" ? "--blocksDown" : "--blocksUp";
  document.documentElement.style.setProperty(`${property}`, `${blocks}`);
  document.documentElement.style.setProperty(`${reset}`, `1`);
}

export default function useMoveAnimations(items: Item[]) {
  const [styleList, setStyleList] = useState<AnimationList>({});
  const timer = useRef<NodeJS.Timeout>(null);

  const finish = (index: number, moveTo: number) => {
    setStyleList([]);
    const updatedItems = [...items];
    const [move] = updatedItems.splice(index, 1);
    updatedItems.splice(moveTo, 0, move);
    const updatedItemsWithKeyEntries = updatedItems.map((item, i) => ({
      ...item, // spread the original item
      keyEntry: i, // update keyEntry to the new index
    }));

    moveItemInList(updatedItemsWithKeyEntries);
  };

  const moveBlock = async (index: number, direction: Direction, blocks: number) => {
    setStyleList([]);
    let moveTo: number;
    const oppositeDirection: Direction = direction === "moveUp" ? "moveDown" : "moveUp";
    if (index >= items.length || index < 0) return;
    const tempList: AnimationList = {};
    tempList[index] = { ...animationStyle(blocks, direction), background: "red" };
    if (direction === "moveUp") {
      moveTo = index - blocks;
      for (let i = index - 1; i >= index - blocks; i--) {
        const delay = index - i - 1;
        console.log({ i, delay });
        tempList[i] = animationStyle(1, oppositeDirection, delay);
      }
    } else {
      moveTo = index + blocks;
      for (let i = index + 1; i <= blocks + index; i++) {
        const delay = i - index - 1;
        console.log({ i, delay });
        tempList[i] = animationStyle(1, oppositeDirection, delay);
      }
    }
    setStyleList(tempList);
    setBlocksMove(direction, blocks);
    timer.current = setTimeout(() => {
      finish(index, moveTo);
    }, 1000 * blocks * speed);
  };
  return { styleList, moveBlock } as const;
}
