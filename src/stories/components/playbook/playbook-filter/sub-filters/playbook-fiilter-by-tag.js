import React from "react";
import { Button, Checkbox, Grid, Input, Popup } from "semantic-ui-react";

export const PlayBookFilterByTag = ({ PlayBookFilterListForTag }) => {
  return (
    <Popup
      inverted
      trigger={
        <Button
          content="Play book Tag"
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
        <Grid.Row>
          <Input icon="search" placeholder="Search swarm purpose..." />
        </Grid.Row>
        {PlayBookFilterListForTag.map((item) => (
          <Grid.Row key={item.value}>
            <Grid.Column width={11}>{item.title}</Grid.Column>
            <Grid.Column width={5}>
              <Checkbox />
            </Grid.Column>
          </Grid.Row>
        ))}
        <Grid.Row>
          <Grid.Column width={8}>
            <div style={{ color: "green" }}>Select All</div>
          </Grid.Column>
          <Grid.Column width={8}>
            <div style={{ color: "pink" }}>Uncheck All</div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Popup>
  );
};
