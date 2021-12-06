import { processFilters } from "../../../../utils/filter";

export const filterByWorkitemIds = ({ data, filter }) => {
  return processFilters({ tree: data.slice(), filter });
};

export const filterByCurrentSwarm = ({ workitems, currentSwarm }) => {
  if (!currentSwarm) {
    return workitems;
  }
  const { chosenSwarms } = currentSwarm;
  return chosenSwarms
    ? workitems.filter((workitem) => chosenSwarms.includes(workitem.swarm))
    : workitems;
};
