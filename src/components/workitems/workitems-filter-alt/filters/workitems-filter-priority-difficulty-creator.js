import React from "react";
import {
  Grid,
  Button,
  Popup,
  Icon,
  Checkbox,
  Responsive,
} from "semantic-ui-react";
import { css } from "glamor";

import "../workitems-filter";

export const WorkitemsFilterPriorityDifficultyCreator = ({
  handleFilterToggle,
  priorityFilter,
  difficultyFilter,
  creatorFilter,
}) => {
  const styles = {
    filtersContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      marginLeft: "10px",
      "& > *": {
        marginRight: "15px",
      },
    },
  };

  return (
    <>
      <Responsive maxWidth={1380}>
        <Popup
          inverted
          trigger={
            <Button data-cy="workitems-filter-priority-difficulty-creator-button-32852" 
              icon="caret down"
              compact
              toggle
              active={priorityFilter || difficultyFilter || creatorFilter}
            />
          }
          flowing
          hoverable
          style={{ width: "180px" }}
        >
          <Grid stretched>
            <Grid.Row key={"priority"}>
              <Grid.Column width={3}>
                <Icon name={"sort amount up"} size="large" />
              </Grid.Column>
              <Grid.Column width={8}>{"Priority"}</Grid.Column>
              <Grid.Column width={5}>
                <Checkbox
                  checked={priorityFilter}
                  onChange={(event) => handleFilterToggle("priority")}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row key={"difficulty"}>
              <Grid.Column width={3}>
                <Icon name={"sort amount up"} size="large" />
              </Grid.Column>
              <Grid.Column width={8}>{"Difficulty"}</Grid.Column>
              <Grid.Column width={5}>
                <Checkbox
                  checked={difficultyFilter}
                  onChange={(event) => handleFilterToggle("difficulty")}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row key={"creator"}>
              <Grid.Column width={3}>
                <Icon name={"user plus"} size="large" />
              </Grid.Column>
              <Grid.Column width={8}>{"Creator"}</Grid.Column>
              <Grid.Column width={5}>
                <Checkbox
                  checked={creatorFilter}
                  onChange={(event) => handleFilterToggle("creator")}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Popup>
      </Responsive>
      <Responsive minWidth={1380}>
        <div {...css(styles.filtersContainer)}>
          <div>
            <Button data-cy="workitems-filter-priority-difficulty-creator-button-42940" 
              icon="sort amount up"
              toggle
              active={priorityFilter}
              compact
              onClick={() => {
                handleFilterToggle("priority");
              }}
            />
          </div>
          <div>
            <Button data-cy="workitems-filter-priority-difficulty-creator-button-39398" 
              icon="sort amount up"
              toggle
              active={difficultyFilter}
              compact
              onClick={() => {
                handleFilterToggle("difficulty");
              }}
            />
          </div>
          <div>
            <Button data-cy="workitems-filter-priority-difficulty-creator-button-64703" 
              icon="user plus"
              toggle
              active={creatorFilter}
              compact
              onClick={() => {
                handleFilterToggle("creator");
              }}
            />
          </div>         
        </div>
      </Responsive>
    </>
  );
};
