import { getMap } from "../shared";

export const swarmSetTreeReducer = (state, action) => {
  const { tree } = action.payload;
  // if (getTreeHash(tree) !== getTreeHash(state.tree)) {
  //   return { ...state, tree, nodeMap: getMap(tree) };
  // }
  return { ...state, tree, nodeMap: getMap(tree) };
};
