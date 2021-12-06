import {
  swarmIndentReducer,
  swarmInitReducer,
  swarmOutdentReducer,
  swarmRefreshReducer,
  swarmRemoveReducer,
  swarmSetCurrentSwarmReducer,
  swarmSetFilterReducer,
  swarmSetTreeReducer,
} from "./reducers";

export const swarmReducer = (state, action) => {
  switch (action.type) {
    case "remove":
      return swarmRemoveReducer(state, action);
    case "indent":
      return swarmIndentReducer(state, action);
    case "outdent":
      return swarmOutdentReducer(state, action);
    case "set-filter":
      return swarmSetFilterReducer(state, action);
    case "set-current-swarm":
      return swarmSetCurrentSwarmReducer(state, action);
    case "set-tree":
      return swarmSetTreeReducer(state, action);
    case "refresh-swarm":
      return swarmRefreshReducer(state, action);
    case "init-swarm":
      return swarmInitReducer(state, action);
    default:
      return state;
  }
};
