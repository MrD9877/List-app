"use client";
import * as React from "react";
const Test = () => {
  const getData = async () => {
    await fetch("http://not-exict.com");
    const req = new Request("/network_mode");
    const res = new Response();
    res.headers.set("x-network_mode", "online");
    const cache = await caches.open("settings");
    const saved = await cache.put(req, res);
    console.log(saved);
  };

  return (
    <div>
      <button onClick={getData}>TEst</button>
      <p>changes33</p>
    </div>
  );
};

export default Test;
