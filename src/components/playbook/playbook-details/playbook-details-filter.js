import { css } from "glamor";
import React from "react";
import { Button, Icon } from "semantic-ui-react";

export const PlayBookDetailsFilterBar = ({
  handleExpand,
  handleCheckAll,
  checkAllFilter,
  handleEditPlayBook,
}) => {
  return (
    <div className="PlayBookFilterBar fix_background_grey_shadow marginBottom20">
      <div
        className="displayFlex marginLR10"
        style={{ justifyContent: "space-between" }}
      >
        <div className="displayFlex">
          <div>
            <Button data-cy="playbook-details-filter-button-62523"  compact icon labelPosition="left" onClick={handleExpand}>
              <Icon name="expand" />
              Expand
            </Button>
          </div>

          <div>
            <Button data-cy="playbook-details-filter-button-10100" 
              compact
              icon
              labelPosition="left"
              onClick={handleEditPlayBook}
            >
              <Icon name="pencil" />
              Edit PlayBook
            </Button>
          </div>

          <div>
            <Button data-cy="playbook-details-filter-button-27001" 
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
        </div>
      </div>
    </div>
  );
};

const styles = {
  buttonBox: {
    whiteSpace: "nowrap",
  },
};

export default PlayBookDetailsFilterBar;
