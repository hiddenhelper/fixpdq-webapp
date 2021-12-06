/* eslint-disable react-hooks/exhaustive-deps */
import _ from "lodash";
import React, { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-semantic-toasts";
import "react-semantic-toasts/styles/react-semantic-alert.css";
import { useActions, useWorkitemsEditForm } from "../../../hooks";
import {
  createNewPlayBook,
  getPlaybookWorkitemAttachmentS3SignedURL,
  updatePlaybookWorkitem,
} from "../../../services/playbook";
import { getSwarm } from "../../../services/swarms";
import {
  downloadAttachmentToLocal,
  getWorkItemAttachmentS3SignedURL,
  updateWorkitem,
  uploadFilesToS3Bucket,
} from "../../../services/workitems";
import {
  CurrentSwarmContext,
  SwarmsContext,
  UsersContext,
  WorkitemsContext,
} from "../../../store/context";
import handlers from "../shared/handlers";
import { POSITION_ACTION } from "../workitems-definitions";
import WorkitemsEditModal from "./workitems-edit.view";

const WorkitemEdit = memo(
  ({ tree, treeParams, params, playbookid, refreshPlaybookWorkitem }) => {
    const {
      swarmActions,
      refreshWorkitemsAfterUpdate,
      workitemsFromCurrentSwarm,
      fetchWorkitemsBySwarms,
    } = useContext(WorkitemsContext);
    const { users } = useContext(UsersContext);
    const { getSwarms } = useContext(CurrentSwarmContext);

    const {
      nodeMapWorkitemId,
      nodeMap,
      getPredecessor,
      getSuccessor,
      getDescendants,
      getLastChild,
      getNeighbors,
    } = treeParams;
    const {
      workitemToEdit,
      openWorkitemEditModal,
      closeWorkitemModal,
    } = params;

    const form = useWorkitemsEditForm();
    const {
      swarms,
      swarmsDropdownOptions,
      loading: swarmsLoading,
    } = useContext(SwarmsContext);

    const {
      prevState,
      workitemsEditForm,
      fetchWorkitemFormData,
      setWorkitemsEditForm,
      isValid,
      clearError,
      handleError,
      // createPayload,
      createPayloadAndReturnChanges,
      setPrevState,
      setIsRequestOnFlight,
      attachment,
    } = form;

    const [usersList, setUsersList] = useState([]);

    const getSwarmUsers = async (swarmid) => {
      const { items } = await getSwarm(swarmid);
      if (items && items.length > 0) {
        const swarmUsers = items[0].users;
        swarmUsers.push({ userid: items[0].creatorid, userrole: "C" });
        swarmUsers.push({ userid: items[0].ownerid, userrole: "O" });

        let filterUsers = [];
        users &&
          users.forEach((user) => {
            if (swarmUsers.find((s) => s.userid === user.Username)) {
              filterUsers.push(user);
            }
          });
        setUsersList(filterUsers);
      }
    };

    const getUsers = async () => {
      await getSwarmUsers(
        workitemsFromCurrentSwarm.find((s) => s.workitemid === workitemToEdit)
          ?.swarm
      );
    };

    useEffect(() => {
      setWorkitemsEditForm(null);
      if (openWorkitemEditModal) {
        fetchWorkitemFormData({
          nodeMapWorkitemId,
          workitemToEdit,
          playbookid,
        });
        if (!playbookid) {
          getUsers();
        }
      }
    }, [openWorkitemEditModal]);

    const updateListView = ({ workitem, changes }) => {
      if (changes) {
        Object.entries(changes).forEach(([key, value]) => {
          swarmActions.dispatchUpdate({
            itemToUpdate: workitem,
            propertyName: key,
            propertyValue: value,
          });
        });
      }
    };

    const handleSubmit = async () => {
      try {
        clearError();
        const isFormValid = isValid();
        if (isFormValid) {
          const { payload, changes } = createPayloadAndReturnChanges(
            treeParams
          );
          setIsRequestOnFlight(true);
          if (attachment !== undefined && attachment.length > 0) {
            for (let index = 0; index < attachment.length; index++) {
              const data = {
                name: attachment[index].name,
                type: attachment[index].type,
              };
              const s3SignedURL = !playbookid
                ? await getWorkItemAttachmentS3SignedURL(workitemToEdit, data)
                : await getPlaybookWorkitemAttachmentS3SignedURL(
                    playbookid,
                    workitemToEdit,
                    data
                  );
              if (s3SignedURL.url) {
                const options = {
                  headers: {
                    "Content-Type": attachment[index].type,
                  },
                };
                const response = await uploadFilesToS3Bucket(
                  s3SignedURL.url,
                  attachment[index],
                  options
                );
                if (response.status === 200) {
                  payload.files.push(data);
                }
              }
            }
          }
          updateListView({
            workitem: nodeMapWorkitemId[workitemToEdit],
            changes,
          });
          closeWorkitemModal();
          const result = !playbookid
            ? await updateWorkitem(workitemToEdit, payload)
            : await updatePlaybookWorkitem(playbookid, workitemToEdit, {
                ...payload,
                date_updated: new Date().getTime(),
              });
          if (result && result.message) {
            toast({
              type: "error",
              icon: "user",
              title: "Error when saving workitem",
              description: `Workitem is being edited by another user`,
              animation: "bounce",
              time: 5000,
            });
            setIsRequestOnFlight(false);
            await fetchWorkitemsBySwarms(getSwarms());
          } else {
            if (playbookid) {
              refreshPlaybookWorkitem();
            }
            setIsRequestOnFlight(false);
          }
        }
      } catch (err) {
        console.log("Error in handleSubmit", err);
        setIsRequestOnFlight(false);
      }
    };

    const saveMoveWorkitem = async () => {
      const updateTimestamp = new Date().getTime();
      const neighbors = getNeighbors(workitemToEdit);
      const nodeMapCopy = { ...nodeMapWorkitemId };
      const { parent, predecessor, successorId, descendants } = neighbors;
      if (prevState.swarm !== workitemsEditForm.swarm) {
        const removePayload = {
          itemToRemove: nodeMapCopy[workitemToEdit],
          parent,
          predecessor,
          successorId,
          descendants,
        };
        swarmActions.dispatchRemove(removePayload);
        closeWorkitemModal();
        await handlers.changeSwarm({
          workitemToEdit,
          workitemsEditForm,
          swarms,
          neighbors,
        });
      }
      if (
        workitemsEditForm["parentid"] &&
        workitemsEditForm["parentid"] !== workitemsEditForm.currentParentId
      ) {
        let newParentLastChild;
        if (workitemsEditForm["parentid"] === "0") {
          newParentLastChild = _.orderBy(
            Object.values(nodeMapCopy).filter((item) => item.isRoot),
            ["sort"],
            ["desc"]
          )[0];
        } else {
          newParentLastChild =
            nodeMapCopy[getLastChild(workitemsEditForm.parentid)];
        }
        const changeParentPayload = {
          itemToMove: nodeMapCopy[workitemToEdit],
          source: {
            parent,
            predecessor,
            successorId,
          },
          destination: {
            parent: nodeMapCopy[workitemsEditForm.parentid],
            parentLastChild: newParentLastChild,
          },
        };
        swarmActions.dispatchChangeParent(changeParentPayload);
        closeWorkitemModal();
        await handlers.changeParent({
          workitemToEdit,
          workitemsEditForm,
          prevState,
          changeParentPayload,
        });
      }
      if (prevState.next !== workitemsEditForm.next) {
        const changeNextPayload = {
          itemToMove: nodeMapCopy[workitemToEdit],
          source: {
            predecessor,
            successorId,
          },
          destination: {
            targetId: workitemsEditForm.next,
            predecessor: getNeighbors(workitemsEditForm.next)?.predecessor,
          },
        };
        swarmActions.dispatchChangeNext(changeNextPayload);
        closeWorkitemModal();
        await handlers.changeNext({
          workitemToEdit,
          workitemsEditForm,
          prevState,
          changeNextPayload,
        });
      }
      await refreshWorkitemsAfterUpdate({
        swarms: getSwarms(),
        updateTimestamp,
      });
    };

    const handleAction = async (action, payload) => {
      try {
        setIsRequestOnFlight(true);
        const result = await updateWorkitem(workitemToEdit, {
          action: {
            name: action,
            payload,
          },
        });
        if (result.message) {
          handleError(result.message);
          setIsRequestOnFlight(false);
          throw Error({ message: "Error in handleAction" });
        } else {
          await fetchWorkitemsBySwarms(getSwarms());
          if (result.status) {
            setPrevState({
              ...prevState,
              status: result.status,
            });
            setWorkitemsEditForm({
              ...workitemsEditForm,
              status: result.status,
            });
            setIsRequestOnFlight(false);
          }
        }
      } catch (err) {
        handleError(JSON.stringify(err));
      }
    };

    const createPlayBook = async (
      playbookname,
      playbookdescription,
      swarmId,
      swarmName
    ) => {
      try {
        const headWorkitem = { ...nodeMapWorkitemId[workitemToEdit] };
        headWorkitem.parentid = "0";
        headWorkitem.next = "0";
        const allRelatedWorkitemIds = getDescendants(workitemToEdit);
        const realtedWorkitems = [];
        realtedWorkitems.push(headWorkitem);
        allRelatedWorkitemIds.forEach((workitemid) => {
          realtedWorkitems.push(nodeMapWorkitemId[workitemid]);
        });

        const body = {
          playbookname: playbookname,
          playbookdescription: playbookdescription,
          workitems: realtedWorkitems,
          swarmid: swarmId,
          swarmname: swarmName,
        };
        await createNewPlayBook(body);
      } catch (error) {
        console.log("There is a error with createNewPlayBook", error);
      }
    };

    const downloadAttachment = async (s3URL, filename) => {
      try {
        const response = await downloadAttachmentToLocal(s3URL);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.log(error);
      }
    };

    const { statusActionHandlers } = useActions({
      workitemsEditForm,
      prevState,
      handleAction,
      users,
    });

    const removeWorkitem = async () => {
      setIsRequestOnFlight(true);
      const id = nodeMapWorkitemId[workitemToEdit].id;
      const payload = {
        positionActions: [
          {
            name: POSITION_ACTION.DELETE,
            payload: {
              successor: getSuccessor(workitemToEdit),
              parent: nodeMap[id].parentid,
              predecessor: getPredecessor(workitemToEdit),
              descendants: getDescendants(workitemToEdit),
            },
          },
        ],
      };
      try {
        if (!playbookid) {
          await updateWorkitem(workitemToEdit, payload);
          await fetchWorkitemsBySwarms(getSwarms());
          setIsRequestOnFlight(false);
          closeWorkitemModal();
        } else {
          updatePlaybookWorkitem(playbookid, workitemToEdit, {
            positionAction: {
              name: POSITION_ACTION.DELETE,
              payload: {
                successor: getSuccessor(workitemToEdit),
                parent: nodeMap[id].parentid,
                predecessor: getPredecessor(workitemToEdit),
                descendants: getDescendants(workitemToEdit),
              },
            },
          });
          refreshPlaybookWorkitem();
          setIsRequestOnFlight(false);
          closeWorkitemModal();
        }
      } catch (error) {
        console.log(error);
        setIsRequestOnFlight(false);
        handleError(JSON.stringify(error));
      }
    };

    return (
      <>
        {form.workitemsEditForm && usersList && (
          <WorkitemsEditModal
            tree={tree}
            nodeMapWorkitemId={nodeMapWorkitemId}
            params={params}
            treeParams={treeParams}
            allUsers={usersList}
            form={form}
            handleSubmit={handleSubmit}
            swarmsDropdownOptions={swarmsDropdownOptions}
            swarmsLoading={swarmsLoading}
            // currentStatus={prevState.status}
            // statusActionHandlers={{
            //   ...statusActionHandlers,
            //   isRequestOnFlight,
            // }}
            createPlayBook={createPlayBook}
            downloadAttachment={downloadAttachment}
            removeWorkitem={removeWorkitem}
            playbookid={playbookid}
            saveMoveWorkitem={saveMoveWorkitem}
          />
        )}
      </>
    );
  }
);

export default WorkitemEdit;
