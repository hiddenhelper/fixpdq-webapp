import getNeighbors from "../index";
import { NODE_MAP_SAMPLE_1 } from "./test1";
import { NODE_MAP_SAMPLE_3 } from "./test3";

test("1.1 Check current level list for ROOT element", () => {
  // For 1577e2ed-8b0a-4f62-968e-d1d696a4d33f -> display = false
  expect(
    getNeighbors.getCurrentLevel(
      "9cad76b2-2ed1-46f7-b425-891a1e986a35",
      NODE_MAP_SAMPLE_1
    ).length
  ).toEqual(10);
});

test("1.2 Check current level list for NON ROOT element (level 1)", () => {
  expect(
    getNeighbors.getCurrentLevel(
      "3aed6f89-c3e2-4af3-bc9a-aa4aad607519",
      NODE_MAP_SAMPLE_1
    ).length
  ).toEqual(4);
});

test("1.3 Check current level list for NON ROOT element (level 2)", () => {
  expect(
    getNeighbors.getCurrentLevel(
      "6bd85335-ba8d-4018-b66f-0303f6af28e4",
      NODE_MAP_SAMPLE_1
    ).length
  ).toEqual(2);
});

test("1.4 Check current level list for NON ROOT element (level 3)", () => {
  expect(
    getNeighbors.getCurrentLevel(
      "542ff62f-2577-4809-a0b9-ced787444c5d",
      NODE_MAP_SAMPLE_1
    ).length
  ).toEqual(1);
});

test("1.5 NODE_MAP is empty", () => {
  expect(
    getNeighbors.getCurrentLevel(
      "542ff62f-2577-4809-a0b9-ced787444c5d",
      NODE_MAP_SAMPLE_3
    ).length
  ).toEqual(0);
});
