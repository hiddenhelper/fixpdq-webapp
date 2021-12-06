import React, { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-solid-svg-icons";

import { FIX_THECOACH_BLACK2_20 } from "../../../utils/static-images";
import { CoachModalContext } from "../../../store/context";
import { Image, Input } from "semantic-ui-react";
import { css } from "glamor";
export const MyTeamsHeader = () => {
  const styles = {
    container: {
      height: "60px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginLeft: "14px",
    },
    cardViewTypeBtn: {
      borderRadius: "8px",
      padding: "10px 20px",
      margin: "0px 5px 0px 0px",
      cursor: "pointer",
    },
    buttonGroup: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    searchBar: {
      position: "absolute",
      left: "10px",
      top: "calc(50% - 10px)",
    },
  };
  const { setOpenCoachModal } = useContext(CoachModalContext);

  return (
    <div {...css(styles.container)}>
      {/* Swap Card View */}
      <div {...css(styles.buttonGroup)}>
        <div
          {...css(styles.cardViewTypeBtn)}
          className={"fix_menu_12 fix_background_yellow_shadow fix_hover_white"}
          data-cy="myteams-header-button-15678"
        >
          <span>MY TEAMS</span>
        </div>
      </div>

      {/* More */}
      <div className="displayFlex">
        <Input
          icon={
            <FontAwesomeIcon
              icon={faSearch}
              className="fix_icon_button_solid_20"
              {...css(styles.searchBar)}
            />
          }
          iconPosition="left"
          placeholder="SEARCH"
          className="fix_menu_grey2_12"
        />
        <Image
          src={FIX_THECOACH_BLACK2_20}
          alt="img"
          width="32px"
          height="32px"
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setOpenCoachModal(true);
          }}
        />
      </div>
    </div>
  );
};

export default MyTeamsHeader;
