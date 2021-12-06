import { STATUS } from "../../../../components/workitems/workitems-definitions";
import { sortList } from "../../../../utils/sort";
import { listToTree } from "../../../../utils/workitems";
import { filterByCurrentSwarm, filterByWorkitemIds } from "./filters";

export const buildTreeForSwarm = ({ items, currentSwarm, filter }) => {
  const filteredByCurentSwarm = filterByCurrentSwarm({
    workitems: items.filter((item) => item.status !== STATUS.DELETED),
    currentSwarm,
  });
  const sorted = sortList(filteredByCurentSwarm);
  const tree = listToTree(sorted);
  const filteredTree = filterByWorkitemIds({ data: tree, filter });
  return filteredTree;
};
