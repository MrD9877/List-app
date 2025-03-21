import React from "react";

export default function PlaceHolder({ viewTransitionName }: { viewTransitionName: string }) {
  return <div style={{ viewTransitionName }} className="w-0 h-0 opacity-0"></div>;
}
