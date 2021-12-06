import { processFilters, convertToNodeMap } from "../../filters-processor";

import { TREE_SAMPLE_1, FILTER_SAMPLE_1 } from "./test1";

test("3.1 ASSIGN under NEW should be visible", () => {
  const filterdTree = processFilters({
    tree: TREE_SAMPLE_1,
    filter: FILTER_SAMPLE_1,
  });
  const nodeMap = convertToNodeMap(filterdTree);
  expect(nodeMap["1cbff5d4-d470-4e21-8f16-906e650a3543"].display).toEqual(true);
});
