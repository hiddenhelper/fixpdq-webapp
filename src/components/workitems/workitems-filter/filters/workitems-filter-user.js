import React from "react";
import { Grid, Button, Popup, Icon, Checkbox } from "semantic-ui-react";

import "../workitems-filter";

// display owner = off => don't display owners => active = false, display = false
// display owner = me => active = true, values: [id]
// display owner = everyone => active = false, display = true

export const WorkitemsFilterUser = ({
  handleFilterSelect,
  owneridFilter,
  filterActions,
  ownerid,
}) => {
  const {
    dispatchDeselect,
    dispatchSelect,
    dispatchSetProperty,
  } = filterActions;

  const setProperties = ({ active, display, selection }) => {
    dispatchSetProperty({
      slice: "ownerid",
      property: "active",
      value: active,
    });
    dispatchSetProperty({
      slice: "ownerid",
      property: "display",
      value: display,
    });
    dispatchSetProperty({
      slice: "ownerid",
      property: "selection",
      value: selection,
    });
  };

  const handleEveryoneChange = () => {
    setProperties({ active: false, display: true, selection: "everyone" });
    dispatchDeselect({ slice: "ownerid" });
  };
  const handleOffChange = () => {
    setProperties({ active: false, display: false, selection: "off" });
    dispatchDeselect({ slice: "ownerid" });
  };
  const handleMeChange = () => {
    setProperties({ active: true, display: true, selection: "me" });
    dispatchSelect({ slice: "ownerid", values: [ownerid] });
  };
  return (
    <Popup
      inverted
      flowing
      pinned
      position="bottom left"
      on='click'
      trigger={
        <Button data-cy="workitems-filter-user-button-87614" 
          icon="user"
          compact
          toggle
          active={owneridFilter.selection !== "off"}
        />
      }
      style={{ width: "180px", backgroundColor: "dimgray" }}
    >
      <Grid stretched>
        <Grid.Row key={"workitems-filter-off"}>
          <Grid.Column width={3}>
            <Icon name={"cancel"} color="red" size="large" />
          </Grid.Column>
          <Grid.Column width={8}>{"off"}</Grid.Column>
          <Grid.Column width={5}>
            <Checkbox
              checked={owneridFilter.selection === "off"}
              onChange={handleOffChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row key={"workitems-filter-me"}>
          <Grid.Column width={3}>
            <Icon name={"user"} color="green" size="large" />
          </Grid.Column>
          <Grid.Column width={8}>{"me"}</Grid.Column>
          <Grid.Column width={5}>
            <Checkbox
              checked={owneridFilter.selection === "me"}
              onChange={handleMeChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row key={"workitems-filter-everyone"}>
          <Grid.Column width={3}>
            <Icon name={"group"} color="white" size="large" />
          </Grid.Column>
          <Grid.Column width={8}>{"everyone"}</Grid.Column>
          <Grid.Column width={5}>
            <Checkbox
              checked={owneridFilter.selection === "everyone"}
              onChange={handleEveryoneChange}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Popup>
  );
};
