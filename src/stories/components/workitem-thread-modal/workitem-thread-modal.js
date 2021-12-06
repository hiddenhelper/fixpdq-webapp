import React from "react";

import WorkItemThreadModalView from "./workitem-thread-modal.view";
import WorkItemThreadModalSidebarView from "../../../components/workitems/workitem-thread-modal/workitem-thread-modal-sidebar.view";
import { Grid } from "semantic-ui-react";
import * as MOCK_ACTIONS_LIST from "./mock-actions-list.json";

export const WorkItemThreadModal = (props) => {
  return (
    <div>
      <Grid columns="equal">
        <Grid.Column width={4}>
          <WorkItemThreadModalSidebarView
            actionsList={MOCK_ACTIONS_LIST.default}
            actionsLoading={false}
            actionsSuccess={true}
            statusActionHandlers={{
              onApprove: () => {},
              onReject: () => {},
            }}
          />
        </Grid.Column>
        <Grid.Column width={12}>
          <WorkItemThreadModalView />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default WorkItemThreadModal;
