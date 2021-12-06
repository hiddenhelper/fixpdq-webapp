import { shouldBeVisible } from "../../filter-utils";

import { FILTER_SAMPLE_1, NODE_SAMPLE_1 } from "./test1";
import { FILTER_SAMPLE_2, NODE_SAMPLE_2 } from "./test2";
import { FILTER_SAMPLE_3, NODE_SAMPLE_3 } from "./test3";
import { FILTER_SAMPLE_4, NODE_SAMPLE_4 } from "./test4";

test('1.1 Check if node satisfies the filters TRUE', () => {
  expect(shouldBeVisible(NODE_SAMPLE_1, FILTER_SAMPLE_1)).toEqual(true);
});

test('1.2. Check if node satisfies the filters: status mismatch', () => {
  expect(shouldBeVisible(NODE_SAMPLE_2, FILTER_SAMPLE_2)).toEqual(false);
});

test('1.3. Check if node satisfies the filters: ownerid mismatch ', () => {
  expect(shouldBeVisible(NODE_SAMPLE_3, FILTER_SAMPLE_3)).toEqual(true);
});

test('1.4. Check if node satisfies the filters: ownerid inactive ', () => {
  expect(shouldBeVisible(NODE_SAMPLE_4, FILTER_SAMPLE_4)).toEqual(true);
});
