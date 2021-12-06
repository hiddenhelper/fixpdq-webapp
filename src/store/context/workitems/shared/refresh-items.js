import { getMap } from "./get-map";
import { buildTreeForSwarm } from "./set-tree-for-swarm";

export const refreshItems = ({
  workitems,
  updatedWorkitems,
  filter,
  currentSwarm,
}) => {
  const refreshedWorkitems = workitems.map(
    (prev) =>
      updatedWorkitems.find((next) => next.workitemid === prev.workitemid) ||
      prev
  );

  const refreshedTree = buildTreeForSwarm({
    items: refreshedWorkitems,
    filter,
    currentSwarm,
  });

  return {
    refreshedWorkitems,
    refreshedTree,
    nodeMap: getMap(refreshedTree),
  };
};
