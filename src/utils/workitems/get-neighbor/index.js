const getCurrentLevel = (workitemid, nodeMapWorkitemId) => {
  if (!nodeMapWorkitemId) {
    return [];
  }
  const parentid = nodeMapWorkitemId[workitemid]
    ? nodeMapWorkitemId[workitemid].parentid
    : "0";
  const currentLevel =
    parentid !== "0"
      ? nodeMapWorkitemId[parentid]._children
      : Object.values(nodeMapWorkitemId).filter((item) => item.isRoot);
  return currentLevel;
};

const getPredecessor = (workitemid, nodeMapWorkitemId) => {
  const list = getCurrentLevel(workitemid, nodeMapWorkitemId);
  if (list.length === 0) {
    return "0";
  }
  // console.log(
  //   "getPredecessor",
  //   list.map((i) => [i.workitemid, i.sort])
  // );
  const index = list.findIndex((item) => item.workitemid === workitemid);
  if (index === 0) {
    return "0";
  }
  return list[index - 1].workitemid;
};

const getSuccessor = (workitemid, nodeMapWorkitemId) => {
  const list = getCurrentLevel(workitemid, nodeMapWorkitemId);
  if (list.length === 0) {
    return "0";
  }
  const index = list.findIndex((item) => item.workitemid === workitemid);
  if (index === list.length - 1) {
    return "0";
  }
  return list[index + 1].workitemid;
};

export default {
  getCurrentLevel,
  getPredecessor,
  getSuccessor,
};
