import React, { useEffect } from "react";

import WorkitemsEditModal from "../../../components/workitems/workitems-edit/workitems-edit.view";
import { useWorkitemsEditForm } from "../../../hooks/use-workitems-edit-form";
import { WORKITEM_STATUS, TRANSITIONS } from "../../../components/workitems/workitems-definitions";
import * as USERS_LIST from "./users-list-mock.json";
import * as MOCK_WORKITEM from "./workitem-mock.json";
import * as MOCK_WORKITEMS from "./workitems-mock.json";
import * as MOCK_NODEMAP from "./nodemap-mock.json";
import * as MOCK_FORM from "./form-mock.json";

const WorkitemsEditModalStory = ({
  params,
  allStatuses,
  allUsers,
  currentStatus,
  ...props
}) => {
  const {
    workitemsEditForm,
    setWorkitemsEditForm,
  } = useWorkitemsEditForm();

  useEffect(() => {
    setWorkitemsEditForm({
      name: MOCK_WORKITEM.name,
      description: "",
      starts: "",
      status: MOCK_WORKITEM.status,
      ends: "",
      creator: MOCK_WORKITEM.ownerid,
      owner: MOCK_WORKITEM.ownerid,
      parentid: MOCK_WORKITEM.parentid,
      currentParent: MOCK_WORKITEM.parentid,
    });
  }, [setWorkitemsEditForm]);

  const statusActionHandlers = {
    handleWorkOnClick: () => {},
    handlePauseClick: () => {},
  };

  return (
    <>
      {workitemsEditForm && (
        <WorkitemsEditModal
          tree={MOCK_WORKITEMS.default}
          nodeMapWorkitemId={MOCK_NODEMAP.default}
          params={params}
          allStatuses={allStatuses}
          allUsers={allUsers}
          form={MOCK_FORM.default}
          handleSubmit={() => {}}
          transitions={TRANSITIONS}
          swarmsDropdownOptions={[{
            key: "123",
            value: "123",
            text: "Some Swarm"
          }]}
          currentStatus={currentStatus}
          statusActionHandlers={statusActionHandlers}
        />
      )}
    </>
  );
};

const Template = (args) => {
  return <WorkitemsEditModalStory {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  params: {
    workitemToEdit: MOCK_WORKITEM.default,
    openWorkitemEditModal: true,
    closeWorkitemModal: () => {
      console.log("closeWorkitemModal");
    },
  },
  allStatuses: WORKITEM_STATUS,
  allUsers: USERS_LIST.Users,
  currentStatus: "ACTIVE"
};

export default {
  title: "components/WORKITEMS/Work Item Edit Modal",
  component: WorkitemsEditModalStory,
};
