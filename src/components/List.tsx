"use client";
import React, { useEffect, useState } from "react";
import ItemBox from "./ItemBox";
import { ArrowBigLeft, Plus } from "lucide-react";
import { InputDialog } from "./InputDialog";
import { flushSync } from "react-dom";
import PlaceHolder from "./PlaceHolder";
import useMoveAnimations from "@/hooks/useMoveAnimations";
import { useSelector } from "react-redux";
import { StoreState } from "@/utility/slice";
import { addItemToList } from "@/utility/ListItemsFn";

export type Direction = "moveUp" | "moveDown";

export type Item = { title: string; description: string; keyEntry: number };

export type AnimationList = { [key: number]: React.CSSProperties };

export default function List({ moveItems }: { moveItems: boolean }) {
  const items = useSelector((state: StoreState) => state.listItems);
  const [display, setDisplay] = useState(false);
  const { styleList, moveBlock } = useMoveAnimations(items);
  const [selected, setSelected] = useState<number>();
  const [moveTo, setMoveTo] = useState<number>();

  useEffect(() => {
    setSelected(undefined);
    setMoveTo(undefined);
  }, [moveItems]);

  const handleDisplay = () => {
    document.startViewTransition(() => {
      flushSync(() => {
        setDisplay((prev) => !prev);
      });
    });
  };

  const addToList = (item: Item) => {
    addItemToList(item);
  };

  return (
    <div className="flex flex-col gap-4">
      <div style={{ gap: "var(--gap)" }} className="max-h-[70vh] flex flex-col overflow-scroll ">
        {items.map((data, index) => {
          return (
            <div className="flex gap-3 items-center" key={data.keyEntry}>
              {moveItems && <input id="default-checkbox" name="default-radio" type="radio" onChange={() => setSelected(index)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm  " />}
              <ItemBox data={data} style={{ ...styleList[index], minHeight: "var(--height)", width: moveItems ? "60vw" : "80vw" }} moveItems={moveItems} />
              {moveItems && (
                <span className="flex items-center">
                  <input id={`moveTo-${index}`} name="moveTo" type="radio" onChange={() => setMoveTo(index)} className="w-0 h-0 " />
                  <label style={{ color: moveTo === index ? "black" : "blue" }} htmlFor={`moveTo-${index}`}>
                    <ArrowBigLeft />
                  </label>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <InputDialog display={display} handleDisplay={handleDisplay} addToList={addToList}>
        <div>
          <button className="p-4 bg-black text-white flex items-center justify-center rounded-2xl w-full">
            Add {!display && <PlaceHolder viewTransitionName="dialog" />} <Plus />
          </button>
        </div>
      </InputDialog>
      <input type="text" id="addToList" className="bg-white w-0 h-0" />
      {typeof selected === "number" && typeof moveTo === "number" && (
        <button className="p-4 bg-black text-white rounded-2xl" onClick={() => moveBlock(selected, "moveUp", selected - moveTo)}>
          Move
        </button>
      )}
    </div>
  );
}
