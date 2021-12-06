import { useRef } from "react";

export const useRenderCounter = (label) => {
  const counter = useRef(0);
  counter.current++;
  console.log(`${label} rendered ${counter.current} times`);
};
