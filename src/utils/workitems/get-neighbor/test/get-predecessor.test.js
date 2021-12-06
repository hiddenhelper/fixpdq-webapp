import getNeighbors from "../index";

import { NODE_MAP_SAMPLE_2 } from "./test2";

test("2.1 Find predecessor", () => {
  expect(
    getNeighbors.getPredecessor(
      "e1ecf29e-3b7d-4ed4-b6dd-b687882cfd03",
      NODE_MAP_SAMPLE_2
    )
  ).toEqual("1758a219-894f-4b8f-8c97-c30224e0bc07");
});

test("2.2 Find predecessor", () => {
  expect(
    getNeighbors.getPredecessor(
      "d7833bf5-e963-4759-a15e-b02412d0342f",
      NODE_MAP_SAMPLE_2
    )
  ).toEqual("58ec1804-7161-4f38-a05c-d4da1d578325");
});

test("2.3 Find predecessor", () => {
  expect(
    getNeighbors.getPredecessor(
      "a01160df-6978-495c-9068-445f8944a32d",
      NODE_MAP_SAMPLE_2
    )
  ).toEqual("0");
});
