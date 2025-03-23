"use client";
import * as React from "react";
const Test = () => {
  const getData = () => {
    const data = localStorage.getItem("appSettings");
    console.log(data);
  };
  const setData = () => {
    const data = localStorage.setItem("test", "tewwwst");
    console.log(data);
  };
  return (
    <div>
      <button onClick={getData}>TEst</button>
      <button onClick={setData}>Set</button>
    </div>
  );
};

export default Test;
