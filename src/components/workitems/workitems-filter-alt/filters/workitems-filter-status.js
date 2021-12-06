import React from "react";
import { Grid, Button, Popup, Checkbox, Image } from "semantic-ui-react";

import "../workitems-filter";

export const WorkitemsFilterStatus = ({
  handleFilterSelect,
  statusFilter,
  allStatuses,
}) => {
  return (
    <Popup
      inverted
      flowing
      pinned
      position="bottom left"
      on="click"
      trigger={
        <Button
          data-cy="workitems-filter-status-button-31999"
          icon="play circle"
          compact
          toggle
          active={statusFilter.length > 0}
        />
      }
      style={{ width: "180px", backgroundColor: "dimgray" }}
    >
      <Grid stretched>
        {allStatuses
          .filter((status) => status.active)
          .map((status) => (
            <Grid.Row key={status.value}>
              <Grid.Column width={4}>
                {/* <Icon name={status.icon} style={{ color: `${status.color}` }} size="large" /> */}
                <Image src={status.src_c} />
              </Grid.Column>
              <Grid.Column width={8}>{status.title}</Grid.Column>
              <Grid.Column width={4}>
                <Checkbox
                  checked={statusFilter.includes(status.value)}
                  onChange={(event) =>
                    handleFilterSelect(status.value, "status")
                  }
                />
              </Grid.Column>
            </Grid.Row>
          ))}
      </Grid>
    </Popup>
  );
};
