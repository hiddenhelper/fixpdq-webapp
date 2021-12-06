import loggedRequest from "../logged-request";

export const getSwarms = async () => {
  return loggedRequest("get", "/swarms");
};

export const getSwarm = async (swarmid) => {
  return loggedRequest("get", `/swarms/${swarmid}`, null, false);
};

export const updateSwarm = async (swarmId, swarm) => {
  return loggedRequest("put", `/swarms/${swarmId}`, swarm);
};

export const createSwarm = async (swarm) => {
  return loggedRequest("post", `/swarms`, swarm);
};

export const createFirstSwarm = async () => {
  return loggedRequest("post", `/swarms/copy`, {});
};
