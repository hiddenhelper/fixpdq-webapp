import React from "react";
import { Button, Checkbox, Grid, Popup } from "semantic-ui-react";

export const PlayBookFilterByCreator = ({ PlayBookFilterListForCreator }) => {
  return (
    <Popup
      inverted
      trigger={
        <Button
          content="Creator"
          labelPosition="right"
          icon="dropdown"
          compact
          toggle
        />
      }
      flowing
      hoverable
      style={{ width: "180px" }}
    >
      <Grid stretched>
        {PlayBookFilterListForCreator.map((item) => (
          <Grid.Row key={item.value}>
            <Grid.Column width={11}>{item.title}</Grid.Column>
            <Grid.Column width={5}>
              <Checkbox />
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    </Popup>
  );
};
