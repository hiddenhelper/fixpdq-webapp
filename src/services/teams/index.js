import loggedRequest from "../logged-request";

export const getAllTeams = async () => {
  return loggedRequest("get", `/teams`);
};

export const getAllTeamsByPersonId = async (personid) => {
  return loggedRequest("get", `/teams?personid=${personid}`);
};

export const getTeamByTeamId = async (teamid) => {
  return loggedRequest("get", `/teams/${teamid}`, null, false);
};

export const createTeam = async (teaminfo) => {
  return loggedRequest("post", `/teams`, teaminfo);
};

export const updateTeam = async (teamid, teaminfo) => {
  return loggedRequest("put", `/teams/${teamid}`, teaminfo);
};

export const deleteTeam = async (teamid) => {
  return loggedRequest("del", `/teams/${teamid}`);
};
