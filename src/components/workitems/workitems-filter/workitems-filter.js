import { css } from "glamor";
import React from "react";
import { Button, Form, Icon, Responsive } from "semantic-ui-react";
import { WORKITEM_STATUS } from "../workitems-definitions";
import {
  WorkitemsFilterPriorityDifficultyCreator,
  WorkitemsFilterStatus,
  WorkitemsFilterUser,
} from "./filters";
import "./workitems-filter.less";

const WorkitemsFilter = ({ params }) => {
  const {
    handleCheckAll,
    handleExpand,
    handleFilterSelect,
    handleFilterToggle,
    filter,
    filterActions,
    ownerid,
  } = params;
  return (
    <div className="filter-container">
      <Responsive minWidth={1200}>
        <div className="workitems-list-filter-section">
          <CheckExpandBar
            handleCheckAll={handleCheckAll}
            handleExpand={handleExpand}
            checkAllFilter={filter.checkAll}
          />
          <div className="workitems-list-filter-separator" />
          <FiltersBar
            handleFilterSelect={handleFilterSelect}
            handleFilterToggle={handleFilterToggle}
            filterActions={filterActions}
            filter={filter}
            ownerid={ownerid}
          />
          <div className="workitems-list-filter-separator" />
          <DueDateRange />
        </div>
      </Responsive>
      <Responsive minWidth={768} maxWidth={1200}>
        <div className="workitems-list-filter-section">
          <CheckExpandBar
            handleCheckAll={handleCheckAll}
            handleExpand={handleExpand}
            checkAllFilter={filter.checkAll}
          />
          <div className="workitems-list-filter-separator" />
          <FiltersBar
            handleFilterSelect={handleFilterSelect}
            filterActions={filterActions}
            handleFilterToggle={handleFilterToggle}
            filter={filter}
            ownerid={ownerid}
          />
        </div>
      </Responsive>
      <Responsive maxWidth={768}>
        <div className="workitems-list-filter-section">
          <FiltersBar
            handleFilterSelect={handleFilterSelect}
            handleFilterToggle={handleFilterToggle}
            filterActions={filterActions}
            filter={filter}
            ownerid={ownerid}
          />
        </div>
      </Responsive>
    </div>
  );
};

const CheckExpandBar = ({ handleCheckAll, handleExpand, checkAllFilter }) => {
  return (
    <div>
      <div {...css(styles.expandColumn)}>
        <div>
          <Button
            data-cy="workitems-filter-button-97330"
            compact
            icon
            toggle
            active={checkAllFilter}
            labelPosition="left"
            onClick={handleCheckAll}
            {...css(styles.buttonBox)}
          >
            {checkAllFilter ? (
              <Icon name="check square" />
            ) : (
              <Icon name="square outline" />
            )}
            Check all
          </Button>
        </div>
        <div>
          <Button
            data-cy="workitems-filter-button-10747"
            compact
            icon
            labelPosition="left"
            onClick={handleExpand}
          >
            <Icon name="expand" />
            Expand
          </Button>
        </div>
      </div>
    </div>
  );
};

const FiltersBar = ({
  handleFilterSelect,
  handleFilterToggle,
  filterActions,
  filter,
  ownerid,
}) => {
  return (
    <div>
      <div {...css(styles.filtersContainer)}>
        <div>VIEW</div>
        <div>
          <WorkitemsFilterUser
            handleFilterSelect={handleFilterSelect}
            filterActions={filterActions}
            owneridFilter={filter ? filter.ownerid : []}
            ownerid={ownerid}
          />
        </div>
        <div>
          <WorkitemsFilterStatus
            handleFilterSelect={handleFilterSelect}
            statusFilter={filter ? filter.status.values : []}
            allStatuses={WORKITEM_STATUS}
          />
        </div>
        <div>
          <Button
            data-cy="workitems-filter-button-20912"
            disabled
            icon="percent"
            compact
            x
          />
        </div>
        <div>
          <Button
            data-cy="workitems-filter-button-8072"
            disabled
            icon="calendar"
            compact
          />
        </div>
        <div>
          <WorkitemsFilterPriorityDifficultyCreator
            handleFilterToggle={handleFilterToggle}
            priorityFilter={filter ? filter.priority : false}
            difficultyFilter={filter ? filter.difficulty : false}
            creatorFilter={filter ? filter.creator : false}
          />
        </div>
      </div>
    </div>
  );
};

const DueDateRange = () => {
  return (
    <div>
      <div {...css(styles.filtersContainer)}>
        <div>Late</div>
        <div>
          <Form.Input
            disabled
            min={100}
            max={2000}
            name="duration"
            step={100}
            type="range"
          />
        </div>
        <div>14+ days</div>
      </div>
    </div>
  );
};

const styles = {
  expandColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    "& > *": {
      marginRight: "15px",
    },
  },
  buttonBox: {
    whiteSpace: "nowrap",
  },
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

export default WorkitemsFilter;
