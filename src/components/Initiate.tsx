"use client";
import { setList } from "@/utility/ListItemsFn";
import React from "react";
import { useEffect } from "react";

export default function Initiate() {
  useEffect(() => {
    setList();
  }, []);
  return <div></div>;
}
