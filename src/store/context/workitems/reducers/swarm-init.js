import { buildTreeForSwarm, getMap } from "../shared";

export const swarmInitReducer = (state, action) => {
  const { workitems, currentSwarm } = action.payload;
  const { filter } = state;
  const tree = buildTreeForSwarm({ items: workitems, filter, currentSwarm });
  return {
    ...state,
    workitems: action.payload.workitems,
    tree,
    nodeMap: getMap(tree),
  };
};
