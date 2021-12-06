import { ListConvertor } from "../list-convertor";
import { TEST1_LIST } from "./fixtures/test1";

// Q dc30443e-8085-4f35-a2be-123ba385e036 > c5e3c005-5df0-4575-bfc8-c5c3b56b4b62
// W c5e3c005-5df0-4575-bfc8-c5c3b56b4b62 > cdf59bc1-22d8-4142-ba36-95bb65d05a04
// A
//   Z 59fe11ac-75a4-4a72-963a-2af221880a4e
//   X 0a23710e-4214-419f-84fc-e4277ae487ab
//   C

test("1.1 Check isRoot", () => {
  const listConverter = new ListConvertor({ list: TEST1_LIST }).sortNodes();
  // console.log(JSON.stringify(listMapper.idToNodeMap));
  expect(listConverter.idToNodeMap).toBeTruthy();
  expect(
    listConverter.idToNodeMap["dc30443e-8085-4f35-a2be-123ba385e036"].isRoot
  ).toEqual(true);
  expect(
    listConverter.idToNodeMap["c5e3c005-5df0-4575-bfc8-c5c3b56b4b62"].isRoot
  ).toEqual(true);
  expect(
    listConverter.idToNodeMap["59fe11ac-75a4-4a72-963a-2af221880a4e"].isRoot
  ).toEqual(false);
  expect(
    listConverter.idToNodeMap["0a23710e-4214-419f-84fc-e4277ae487ab"].isRoot
  ).toEqual(false);
});
