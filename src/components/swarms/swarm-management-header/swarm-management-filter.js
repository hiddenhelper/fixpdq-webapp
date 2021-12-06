import { css } from "glamor";
import React from "react";
import { Button, Form } from "semantic-ui-react";

export const SwarmManagementFilter = () => {
  return (
    <div {...css(styles.filterbar)}>
      <FiltersBar />
      <DueDateRange />
    </div>
  );
};

const FiltersBar = () => {
  return (
    <div {...css(styles.filtersContainer)}>
      <div>VIEW</div>
      <div>
        <Button data-cy="swarm-management-filter-button-50330"  icon="user" toggle compact />
      </div>
      <div>
        <Button data-cy="swarm-management-filter-button-36220"  disabled icon="percent" compact x />
      </div>
      <div>
        <Button data-cy="swarm-management-filter-button-39719"  disabled icon="calendar" compact />
      </div>
    </div>
  );
};

const DueDateRange = () => {
  return (
    <div {...css(styles.filtersContainer)}>
      <div {...css(styles.filterSeparator)} />
      <div>Late</div>
      <div>
        <Form.Input
          disabled
          min={0}
          max={14}
          name="duration"
          step={1}
          type="range"
        />
      </div>
      <div>14+ days</div>
    </div>
  );
};

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
  filterSeparator: {
    width: "0.1em",
    height: "2em",
    backgroundColor: "rgb(109,109,109)",
  },
  filterbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    backgroundColor: "rgb(242, 242, 242)",
    border: "solid",
    borderColor: "rgb(242, 242, 242)",
    borderRadius: "10px",
    minHeight: "3em",
  },
};

export default SwarmManagementFilter;
