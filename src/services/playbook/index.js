import loggedRequest from "../logged-request";

export const createNewPlayBook = async (playbookdata) => {
  return loggedRequest("post", `/playbooks`, playbookdata);
};

export const getPlaybooksBySwarmId = async (swarmid) => {
  return loggedRequest("get", `/playbooks?swarmid=${swarmid}`);
};

export const getPlaybooksBySwarmsList = async (swarmid, swarms) => {
  return loggedRequest(
    "get",
    `/playbooks?swarmid=${swarmid}&swarms=${swarms.join(",")}`
  );
};

export const getAllPlaybooks = async () => {
  return loggedRequest("get", `/playbooks`);
};

export const getPlaybookById = async (playbookid) => {
  return loggedRequest("get", `/playbooks/${playbookid}`, null, false);
};

export const getWorkitemFromPlaybook = async (playbookid, workitemid) => {
  return loggedRequest(
    "get",
    `/playbooks/${playbookid}?workitemid=${workitemid}`
  );
};

export const getPlaybookWorkItemAttachmentDownloadURL = async (
  playbookid,
  workitemid,
  data
) => {
  return loggedRequest(
    "post",
    `/playbooks?getSignedURL=no&playbookid=${playbookid}&workitemid=${workitemid}`,
    data
  );
};

export const getPlaybookWorkitemAttachmentS3SignedURL = async (
  playbookid,
  workitemid,
  data
) => {
  return loggedRequest(
    "post",
    `/playbooks?getSignedURL=yes&playbookid=${playbookid}&workitemid=${workitemid}`,
    data
  );
};

export const updatePlaybookWorkitem = async (playbookid, workitemid, data) => {
  return loggedRequest(
    "put",
    `/playbooks/${playbookid}?workitemid=${workitemid}`,
    data
  );
};

export const deletePlaybookWorkitem = async (playbookid, workitemid) => {
  return loggedRequest(
    "del",
    `/playbooks/${playbookid}?workitemid=${workitemid}`
  );
};
