import moment from "moment";
import { useContext, useState } from "react";
import { STATUS } from "../components/workitems/workitems-definitions";
import { usePayloadBuilderEditForm } from "../hooks";
import {
  getPlaybookWorkItemAttachmentDownloadURL,
  getWorkitemFromPlaybook,
} from "../services/playbook";
import {
  getWorkitem,
  getWorkItemAttachmentDownloadURL,
} from "../services/workitems";
import { UsersContext } from "../store/context";
import editorUtils from "../utils/editor";

export const useWorkitemsEditForm = () => {
  const { fetchUsersList } = useContext(UsersContext);

  const [workitemsEditForm, setWorkitemsEditForm] = useState(null);
  const [prevState, setPrevState] = useState(null);
  const [workitemsEditErrorMessage, setWorkitemsEditErrorMessage] = useState(
    ""
  );
  const [hasError, setHasError] = useState(false);
  const [isRequestOnFlight, setIsRequestOnFlight] = useState(false);
  const [attachment, setAttachments] = useState([]);
  const { getPayload } = usePayloadBuilderEditForm({
    workitemsEditForm,
    prevState,
  });

  const onChange = (e, { name, value }) => {
    switch( name ) {
      case "swarm":
        setWorkitemsEditForm({ ...workitemsEditForm, [name]: value, parentid: "0", next: "0" });  
        break;
      case "parentid":
        setWorkitemsEditForm({ ...workitemsEditForm, [name]: value, next: "0" });  
        break;
      default:
        setWorkitemsEditForm({ ...workitemsEditForm, [name]: value });
        break;
    }
  };

  const clearField = (name) => {
    setWorkitemsEditForm({ ...workitemsEditForm, [name]: "" });
  };

  const handleError = (message) => {
    setHasError(true);
    setWorkitemsEditErrorMessage(message);
  };

  const isValid = () => {
    if (workitemsEditForm.name && workitemsEditForm.name.length > 100) {
      handleError("Name shoudn't be greater than 100 characters long");
      return false;
    }
    if (
      workitemsEditForm[`description`] &&
      editorUtils.getTextFromString(workitemsEditForm.description).length > 1000
    ) {
      handleError("Description shoudn't be greater than 3000 characters long");
      return false;
    }

    if (
      workitemsEditForm["ends"] &&
      workitemsEditForm["starts"] &&
      new Date(workitemsEditForm["ends"]).getTime() <
        new Date(workitemsEditForm["starts"]).getTime()
    ) {
      handleError("End time should be greater than start time");
      return false;
    }

    if (workitemsEditForm.creator.trim() === "") {
      handleError("Creator shouldn't be empty");
      return false;
    }

    if (workitemsEditForm.creator !== prevState.creator) {
      handleError("Creator can't be changed");
      return false;
    }

    if (workitemsEditForm.status === STATUS.REVIEW && !prevState.owner) {
      handleError("Work item should have an assigned owner");
      return false;
    }

    return true;
  };

  const clearError = () => {
    setHasError(false);
    setWorkitemsEditErrorMessage("");
  };

  const getForm = (
    workitem,
    nodeMapWorkitemId,
    workitemToEdit,
    downloadFileURL
  ) => {
    return {
      currentParentId: nodeMapWorkitemId[workitemToEdit].parentid
        ? nodeMapWorkitemId[workitemToEdit].parentid
        : "0",
      workitemid: workitemToEdit,
      name: workitem.name,
      status: workitem.status,
      swarm: workitem.swarm,
      swarmName: workitem.swarm_name,
      description: workitem["description"] || "",
      starts: workitem["start_time"]
        ? moment(new Date(workitem["start_time"])).format("yyyy-MM-DDTHH:mm")
        : "",
      ends: workitem["end_time"]
        ? moment(new Date(workitem["end_time"])).format("yyyy-MM-DDTHH:mm")
        : "",
      creator: workitem.creatorid,
      owner: workitem.ownerid,
      next: workitem.next,
      actionid: workitem.actionid,
      files: workitem.files ? workitem.files : [],
      downloadFileURL: downloadFileURL,
      priority: workitem.priority,
      difficulty: workitem.difficulty,
      partyMembers: workitem.partyMembers ? workitem.partyMembers : [],
    };
  };

  const createPayload = () => {
    const { payload } = getPayload();
    return {
      ...payload,
    };
  };

  const createPayloadAndReturnChanges = () => {
    const payloadAndChanges = getPayload();
    return payloadAndChanges;
  };

  const fetchWorkitemFormData = async ({
    nodeMapWorkitemId,
    workitemToEdit,
    playbookid,
  }) => {
    try {
      const { item } = !playbookid
        ? await getWorkitem(workitemToEdit)
        : await getWorkitemFromPlaybook(playbookid, workitemToEdit);
      const workitem = item[0];
      if (workitem) {
        let downloadFileURL = [];
        if (workitem.files) {
          workitem.files.forEach(async (file) => {
            const response = !playbookid
              ? await getWorkItemAttachmentDownloadURL(workitemToEdit, file)
              : await getPlaybookWorkItemAttachmentDownloadURL(
                  playbookid,
                  workitemToEdit,
                  file
                );
            if (response.url) {
              downloadFileURL.push(response.url);
            } else {
              downloadFileURL.push("");
            }
          });
        }
        setPrevState(
          getForm(workitem, nodeMapWorkitemId, workitemToEdit, downloadFileURL)
        );
        setWorkitemsEditForm(
          getForm(workitem, nodeMapWorkitemId, workitemToEdit, downloadFileURL)
        );
      }
    } catch (err) {
      setWorkitemsEditForm(null);
      console.log(err);
    }
    await fetchUsersList();
  };

  return {
    workitemsEditForm,
    workitemsEditErrorMessage,
    hasError,
    prevState,
    isRequestOnFlight,
    setWorkitemsEditForm,
    onChange,
    clearField,
    isValid,
    clearError,
    handleError,
    createPayload,
    createPayloadAndReturnChanges,
    setPrevState,
    fetchWorkitemFormData,
    setIsRequestOnFlight,
    attachment,
    setAttachments,
  };
};
