import { areChildrenVisible } from "../../filter-utils";

import { NODE_SAMPLE_1, WORKITEMS_SAMPLE_1 } from "./test1";
import { NODE_SAMPLE_2, WORKITEMS_SAMPLE_2 } from "./test2";

test('2.1 Check if ALL the children are visible TRUE', () => {
  expect(areChildrenVisible(NODE_SAMPLE_1, WORKITEMS_SAMPLE_1)).toEqual(true);
});

test('2.2 Check if ALL the children are visible FALSE', () => {
  expect(areChildrenVisible(NODE_SAMPLE_2, WORKITEMS_SAMPLE_2)).toEqual(false);
});
