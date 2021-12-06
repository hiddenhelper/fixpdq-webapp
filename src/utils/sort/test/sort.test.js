import { convertToNodeMap } from "../../workitems/tree-traverse";
import { SortList } from "../index";
import { TEST1_LIST } from "./fixtures/test1";
import { TEST2_LIST } from "./fixtures/test2";
import { TEST3_LIST } from "./fixtures/test3";
import { TEST4_LIST } from "./fixtures/test4";

// Q dc30443e-8085-4f35-a2be-123ba385e036 > c5e3c005-5df0-4575-bfc8-c5c3b56b4b62
// W c5e3c005-5df0-4575-bfc8-c5c3b56b4b62 > cdf59bc1-22d8-4142-ba36-95bb65d05a04
// A
//   Z 59fe11ac-75a4-4a72-963a-2af221880a4e
//   X 0a23710e-4214-419f-84fc-e4277ae487ab
//   C

test("1.1 Check order when sort attribute has been already defined ", () => {
  const sortedList = new SortList({ list: TEST1_LIST }).getUpdatedList();
  // console.log(JSON.stringify(listMapper.idToNodeMap));
  const nodeMap = convertToNodeMap(sortedList);
  expect(nodeMap).toBeTruthy();
  expect(
    nodeMap["dc30443e-8085-4f35-a2be-123ba385e036"].sort <
      nodeMap["c5e3c005-5df0-4575-bfc8-c5c3b56b4b62"].sort
  ).toEqual(true);
  expect(
    nodeMap["59fe11ac-75a4-4a72-963a-2af221880a4e"].sort <
      nodeMap["0a23710e-4214-419f-84fc-e4277ae487ab"].sort
  ).toEqual(true);
});

test("1.2 Check order when sort attribute has been set to default value ", () => {
  const sortedList = new SortList({ list: TEST2_LIST }).getUpdatedList();
  // console.log(JSON.stringify(listMapper.idToNodeMap));
  const nodeMap = convertToNodeMap(sortedList);
  expect(nodeMap).toBeTruthy();
  expect(
    nodeMap["dc30443e-8085-4f35-a2be-123ba385e036"].sort <
      nodeMap["c5e3c005-5df0-4575-bfc8-c5c3b56b4b62"].sort
  ).toEqual(true);
  expect(
    nodeMap["59fe11ac-75a4-4a72-963a-2af221880a4e"].sort <
      nodeMap["0a23710e-4214-419f-84fc-e4277ae487ab"].sort
  ).toEqual(true);
});

test("1.3 Check order when sort is undefined", () => {
  const sortedList = new SortList({ list: TEST3_LIST }).getUpdatedList();
  // console.log(JSON.stringify(listMapper.idToNodeMap));
  const nodeMap = convertToNodeMap(sortedList);
  expect(nodeMap).toBeTruthy();
  expect(
    nodeMap["dc30443e-8085-4f35-a2be-123ba385e036"].sort <
      nodeMap["c5e3c005-5df0-4575-bfc8-c5c3b56b4b62"].sort
  ).toEqual(true);
  expect(
    nodeMap["59fe11ac-75a4-4a72-963a-2af221880a4e"].sort <
      nodeMap["0a23710e-4214-419f-84fc-e4277ae487ab"].sort
  ).toEqual(true);
});

// Actual
// X
// C
// Q

// Expected
// X
// Q  3b41cb93-5264-4d36-82b4-8caca159be05
// C  d8a6e0af-229b-408e-a269-692da4a5a8f7

test("1.4 Check order ", () => {
  const sortedList = new SortList({ list: TEST4_LIST }).getUpdatedList();
  // console.log(JSON.stringify(listMapper.idToNodeMap));
  const nodeMap = convertToNodeMap(sortedList);
  expect(nodeMap).toBeTruthy();
  expect(
    nodeMap["3b41cb93-5264-4d36-82b4-8caca159be05"].sort <
      nodeMap["d8a6e0af-229b-408e-a269-692da4a5a8f7"].sort
  ).toEqual(true);
});
