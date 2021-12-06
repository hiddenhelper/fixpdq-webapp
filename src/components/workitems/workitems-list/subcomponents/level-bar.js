import { faFlag, faTachometerAltFast } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "glamor";
import React, { memo } from "react";
import { PRIORITY_DIFFICULTY_STATUS } from "../../workitems-definitions";

export const LevelBar = memo(
  ({ playbookid, title, level, item, onChangeLevel, }) => {
    const styles = {
      container: {
        borderRadius: "8px",
        padding: "3px 3px 3px 8px",
      },
    };

    const show_Priority_Difficulty = () => {
      const num =
        PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === level)
          ?.value || 0;
      return PRIORITY_DIFFICULTY_STATUS.map((s, index) => {
        if (index <= num) {
          return (
            <FontAwesomeIcon
              icon={title === "Priority" ? faFlag : faTachometerAltFast}
              className={
                PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === level)
                  ?.color_card
              }
              style={{ marginRight: "5px" }}
              key={index}
              onClick={() => {
                onChangeLevel({
                  workitemid: item.workitemid,
                  title: title.toLowerCase(),
                  value: s.name ? s.name : level,
                  owner: item.ownerid,
                  creator: item.creatorid,
                });
              }}
            />
          );
        }
        return (
          <FontAwesomeIcon
            icon={title === "Priority" ? faFlag : faTachometerAltFast}
            className="fix_icon_action_grey2_10"
            style={{ marginRight: "5px" }}
            key={index}
            onClick={() => {
              onChangeLevel({
                workitemid: item.workitemid,
                title: title.toLowerCase(),
                value: s.name ? s.name : level,
                owner: item.ownerid,
                creator: item.creatorid,
              });
            }}
          />
        );
      });
    };

    return (
      <>
        <div {...css(styles.container)} className="fix_background_grey1">
          {show_Priority_Difficulty()}
        </div>
      </>
    );
  }
);
