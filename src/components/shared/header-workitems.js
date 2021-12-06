import React, { useEffect, useContext, useState } from "react";
import { css } from "glamor";
import { Breadcrumb, Icon, Input, Image } from "semantic-ui-react";

import { CurrentSwarmContext, CoachModalContext } from "../../store/context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import { FIX_THECOACH_BLACK2_20 } from "../../utils/static-images";

const HeaderWorkitems = () => {
  const [sections, setSections] = useState([]);
  const { currentSwarm } = useContext(CurrentSwarmContext);
  const { setOpenCoachModal } = useContext(CoachModalContext);

  useEffect(() => {
    if (currentSwarm) {
      setSections([
        { key: "currentSwarm", content: currentSwarm.name, link: false },
        // { key: "Workitem1", content: "Workitem name", link: true },
        // { key: "Workitem3", content: "Workitem name", active: true },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSwarm]);

  return (
    <div>
      <div {...css(styles.container)}>
        <div>
          <Icon name="list" {...css(styles.itemIcon)} />
          <Breadcrumb icon="right angle" sections={sections} />
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
    </div>
  );
};

const styles = {
  container: {
    height: "60px",
    alignItems: "center",
    display: "flex",
    marginLeft: 20,
    justifyContent: "space-between",
  },
  itemIcon: {
    marginRight: 10,
  },
  searchBar: {
    position: "absolute",
    left: "10px",
    top: "calc(50% - 10px)",
  },
};

export default HeaderWorkitems;
