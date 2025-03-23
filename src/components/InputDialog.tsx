import { useState } from "react";
import { Item } from "./List";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { StoreState } from "@/utility/slice";

type InputDialog = { children: React.ReactNode; handleDisplay: () => void; display: boolean; addToList: (item: Item) => void };

export function InputDialog({ children, handleDisplay, display, addToList }: InputDialog) {
  const [newItem, setItem] = useState<Omit<Item, "keyEntry" | "read">>({ title: "", description: "" });
  const item = useSelector((state: StoreState) => state.listItems);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: "description" | "title") => {
    setItem((pre) => ({ ...pre, [type]: e.target.value }));
  };
  const handleSave = async () => {
    let keyEntry: number = 0;
    if (item.length > 0) {
      keyEntry = item[item.length - 1].keyEntry + 1;
    }
    addToList({ ...newItem, keyEntry, read: false });
    setItem({ title: "", description: "" });
    handleDisplay();
  };
  return (
    <div>
      <div onClick={handleDisplay}>{children}</div>
      {display && (
        <div style={{ viewTransitionName: "dialog" }} className="absolute h-[100svh] w-screen  top-0 left-0 p-4 flex justify-center items-center bg-black/45">
          <div className="w-[70vw] bg-white rounded-2xl px-4 pt-2 pb-4 flex flex-col gap-4 h-fit">
            <div className="w-full flex justify-end">
              <button onClick={handleDisplay}>
                <X />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 items-start justify-baseline">
                <label htmlFor="name" className="">
                  Title:
                </label>
                <input value={newItem.title || ""} onChange={(e) => handleInput(e, "title")} id="name" className="border border-black px-2 " />
              </div>
              <div className="grid grid-cols-2 items-start justify-baseline">
                <label htmlFor="username" className="">
                  Description:
                </label>
                <input value={newItem.description || ""} id="username" onChange={(e) => handleInput(e, "description")} className="border border-black px-2" />
              </div>
            </div>
            <footer>
              <button onClick={handleSave} className="px-2 py-1.5 bg-black text-white flex items-center justify-center rounded-lg w-fit">
                Save
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
