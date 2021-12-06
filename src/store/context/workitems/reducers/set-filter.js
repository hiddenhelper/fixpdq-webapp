import { buildTreeForSwarm } from "../shared";

export const swarmSetFilterReducer = (state, action) => {
  const { filter } = action.payload;
  const { workitems, currentSwarm } = state;
  return {
    ...state,
    filter,
    tree: buildTreeForSwarm({ items: workitems, currentSwarm, filter }),
  };
};
