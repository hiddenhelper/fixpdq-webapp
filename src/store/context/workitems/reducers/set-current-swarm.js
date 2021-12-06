import { filterByCurrentSwarm } from "../shared";

export const swarmSetCurrentSwarmReducer = (state, action) => {
  const { currentSwarm } = action.payload;
  return {
    ...state,
    currentSwarm,
    workitemsFromCurrentSwarm: filterByCurrentSwarm({
      workitems: state.workitems,
      currentSwarm,
    }),
  };
};
