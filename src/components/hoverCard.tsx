import { HoverCard, HoverCardContent } from "@/components/ui/hover";
import { HoverCardTrigger } from "@/components/ui/hover";
import { Item } from "./List";

export function HoverCardDemo({ data }: { data: Item }) {
  return (
    <HoverCard open={true} defaultOpen={true}>
      <HoverCardTrigger></HoverCardTrigger>
      <HoverCardContent className=" bg-black/80 text-white flex justify-center mx-4 w-[80vw]" defaultChecked={true}>
        <div className="flex justify-between space-x-4 w-3/4">
          <div className="space-y-1">
            <p className="text-sm">{data.description}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
