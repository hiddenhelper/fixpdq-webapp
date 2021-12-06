import React, { useContext } from "react";
import { css } from "glamor";
import { Image, Input } from "semantic-ui-react";
import { FIX_THECOACH_BLACK2_20 } from "../../utils/static-images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import { CoachModalContext } from "../../store/context";

const HeaderDashboard = ({ cardType, setCardType }) => {
  const { setOpenCoachModal } = useContext(CoachModalContext);
  return (
    <div {...css(styles.container)}>
      {/* Swap Card View */}
      <div {...css(styles.buttonGroup)}>
        <div
          {...css(styles.cardViewTypeBtn)}
          className={
            cardType === "PEOPLE"
              ? "fix_menu_12 fix_background_yellow_shadow fix_hover_white"
              : "fix_menu_12 fix_hover_yellow"
          }
          onClick={() => {
            setCardType("PEOPLE");
          }}
        >
          <span>PEOPLE</span>
        </div>
        <div
          {...css(styles.cardViewTypeBtn)}
          className={
            cardType === "WORKITEM"
              ? "fix_menu_12 fix_background_yellow_shadow fix_hover_white"
              : "fix_menu_12 fix_hover_yellow"
          }
          onClick={() => {
            setCardType("WORKITEM");
          }}
        >
          <span>SWARM OVERVIEW</span>
        </div>
      </div>

      {/* More */}
      <div className="displayFlex">
        <Input icon={<FontAwesomeIcon icon={faSearch} className="fix_icon_button_solid_20" {...css(styles.searchBar)}/>} iconPosition="left" placeholder="SEARCH" className="fix_menu_grey2_12"/>
        <Image
          src={FIX_THECOACH_BLACK2_20}
          alt="img"
          width="32px"
          height="32px"
          style={{marginLeft: "10px"}}
          onClick={()=>{
            setOpenCoachModal(true);
          }}
        />
      </div>
    </div>
  );
};

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
    top: "calc(50% - 10px)"
  },
};

export default HeaderDashboard;
