import React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/Drawer";
import { deleteItemFromList } from "@/utility/ListItemsFn";
import { Trash2Icon } from "lucide-react";

export const convertUrlId = (url: string) => {
  const { pathname } = new URL(url);
  const fileId = pathname.split("/")[1];
  return fileId;
};
export default function DeletePromt({ setSwipe, Itemkey }: { setSwipe: React.Dispatch<React.SetStateAction<"left" | "right" | undefined>>; Itemkey: number }) {
  const deleteFn = async () => {
    try {
      await deleteItemFromList(Itemkey);
      setSwipe(undefined);
    } catch {
      console.log("error while deleting");
    }
  };

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild className="flex justify-center items-center">
          <button>
            <Trash2Icon stroke="red" />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm bg-white">
            <DrawerHeader>
              <DrawerTitle>Delete</DrawerTitle>
              <DrawerDescription>Are you sure you want to permanetly delete this entry?</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button className="bg-red-500" onClick={deleteFn}>
                  Delete
                </Button>
              </DrawerClose>

              <DrawerClose asChild>
                <Button variant="outline" onClick={() => setSwipe(undefined)}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
