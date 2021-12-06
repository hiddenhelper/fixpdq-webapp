import getNeighbors from "../index";

import { NODE_MAP_SAMPLE_2 } from "./test2";

test("2.1 Find successor", () => {
  expect(
    getNeighbors.getSuccessor(
      "0af6e22d-c0d1-4cf7-82ea-0f0ca8ae7ec2",
      NODE_MAP_SAMPLE_2
    )
  ).toEqual("c983942d-b288-41eb-8f9d-eda4797dded7");
});

test("2.2 Find successor", () => {
  expect(
    getNeighbors.getSuccessor(
      "58ec1804-7161-4f38-a05c-d4da1d578325",
      NODE_MAP_SAMPLE_2
    )
  ).toEqual("d7833bf5-e963-4759-a15e-b02412d0342f");
});

test("2.3 Find successor", () => {
  expect(
    getNeighbors.getSuccessor(
      "d7833bf5-e963-4759-a15e-b02412d0342f",
      NODE_MAP_SAMPLE_2
    )
  ).toEqual("0");
});
