import { ListMapper } from "../list-mapper";
import { TEST1_LIST, TEST1_SNAPSHOT } from "./fixtures/test1";

test("1.1 List has 3 nested elements", () => {
  const listMapper = new ListMapper({ list: TEST1_LIST });
  // console.log(JSON.stringify(listMapper.idToNodeMap));
  expect(listMapper.idToNodeMap).toBeTruthy();
  expect(
    listMapper.idToNodeMap["8cf172a7-613b-410f-8c6c-9fa248654ce8"].parentid
  ).toEqual("0");
  expect(
    listMapper.idToNodeMap["70a544bc-6df0-4928-b781-0fc613bb5326"].parentid
  ).toEqual("8cf172a7-613b-410f-8c6c-9fa248654ce8");
  expect(
    listMapper.idToNodeMap["98d0e144-46d0-4f88-8ed4-25384ba87952"].parentid
  ).toEqual("70a544bc-6df0-4928-b781-0fc613bb5326");
  expect(
    listMapper.idToNodeMap["8cf172a7-613b-410f-8c6c-9fa248654ce8"]._children[0]
      ._children.length
  ).toEqual(1);
});

test("1.2 List has 3 nested elements - SNAPSHOT", () => {
  const listMapper = new ListMapper({ list: TEST1_LIST });
  // console.log(JSON.stringify(listMapper.idToNodeMap));
  expect(listMapper.idToNodeMap).toEqual(TEST1_SNAPSHOT);
});
