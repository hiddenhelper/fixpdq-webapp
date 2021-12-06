import axios from "axios";
import loggedRequest from "../logged-request";

export const getWorkitems = async () => {
  return loggedRequest("get", `/workitems`);
};

export const getWorkitemsFromSwarms = async (swarms) => {
  return loggedRequest("get", `/workitems?swarms=${swarms.join(",")}`);
};

export const createWorkitem = async (workitem) => {
  return loggedRequest("post", `/workitems`, workitem);
};

export const updateWorkitem = async (workitemId, workitem) => {
  return loggedRequest("put", `/workitems/${workitemId}`, workitem);
};

export const getWorkitem = async (workitemid) => {
  return loggedRequest("get", `/workitems/${workitemid}`, null, false);
};

export const getWorkItemAttachmentS3SignedURL = async (workitemid, data) => {
  return loggedRequest(
    "post",
    `/workitems?getSignedURL=yes&workitemid=${workitemid}`,
    data
  );
};

export const uploadFilesToS3Bucket = async (url, data, options) => {
  return axios.put(url, data, options);
};

export const getWorkItemAttachmentDownloadURL = async (workitemid, data) => {
  return loggedRequest(
    "post",
    `/workitems?getSignedURL=no&workitemid=${workitemid}`,
    data,
    false
  );
};

export const downloadAttachmentToLocal = async (s3URL) => {
  return await axios.get(s3URL, { responseType: "blob" });
};

export const getUpdatedWorkitems = async ({
  timestamp,
  swarms,
  playbookid,
}) => {
  let queryParams = `?timestamp=${timestamp}`;
  if (swarms) {
    queryParams += `&swarms=${swarms.join(",")}`;
  }
  if (playbookid) {
    queryParams += `&playbookid=${playbookid}`;
  }
  if (!swarms && !playbookid) {
    throw new Error("Either swarms or playbookid must be decalred");
  }
  return loggedRequest("get", `/workitems${queryParams}`);
};

export const deleteWorkitem = async (workitemid) => {
  return loggedRequest("del", `/workitems/${workitemid}`, null, false);
};
