import React, { memo, useState } from "react";
import { Popup, Image } from "semantic-ui-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faOutdent,
  faIndent,
  faCopy,
  faArrowsAlt,
  faTrash,
  faPen,
} from "@fortawesome/pro-solid-svg-icons";

import { FIX_THECOACH_BLACK_20 } from "../../../../utils/static-images";
import { css } from "glamor";

export const ContextMenu = memo(
  ({
    onBackwardClick,
    onForwardClick,
    onConversationClick,
    onEditClick,
    itemid,
    workitemid,
    playbookid,
    removeWorkitem,
    onMoveWorkitemModalClick,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => {
      setIsOpen(true);
    };
    const handleClose = () => {
      setIsOpen(false);
    };

    const styles = {
      menuItem: {
        marginRight: "5px",
        width: "20px",
      },
    };

    return (
      <div style={{ marginLeft: "-35px", minWidth: "35px", maxWidth: "35px" }}>
        {!playbookid && (
          <Popup
            on="click"
            trigger={
              <div>
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="fix_icon_bar_10"
                />
              </div>
            }
            open={isOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            position="bottom left"
          >
            <div className="displayFlex">
              <div
                onClick={(event) => {
                  onBackwardClick(event, { id: itemid, playbookid });
                  handleClose();
                }}
                {...css(styles.menuItem)}
              >
                <FontAwesomeIcon icon={faOutdent} className="fix_icon_bar_10" />
              </div>

              <div
                onClick={(event) => {
                  onForwardClick(event, { id: itemid, playbookid });
                  handleClose();
                }}
                {...css(styles.menuItem)}
              >
                <FontAwesomeIcon icon={faIndent} className="fix_icon_bar_10" />
              </div>

              <div {...css(styles.menuItem)}>
                <FontAwesomeIcon icon={faCopy} className="fix_icon_bar_10" />
              </div>

              <div
                onClick={() => {
                  onMoveWorkitemModalClick({ id: workitemid });
                  handleClose();
                }}
                {...css(styles.menuItem)}
              >
                <FontAwesomeIcon
                  icon={faArrowsAlt}
                  className="fix_icon_bar_10"
                />
              </div>

              <div
                onClick={() => {
                  handleClose();
                  removeWorkitem(workitemid);
                }}
                {...css(styles.menuItem)}
              >
                <FontAwesomeIcon icon={faTrash} className="fix_icon_bar_10" />
              </div>

              <div
                onClick={(event) => {
                  onEditClick(event, { id: workitemid });
                  handleClose();
                }}
                {...css(styles.menuItem)}
              >
                <FontAwesomeIcon icon={faPen} className="fix_icon_bar_10" />
              </div>

              <div
                onClick={(event) => {
                  onConversationClick(event, { id: workitemid });
                  handleClose();
                }}
                {...css(styles.menuItem)}
              >
                <Image
                  src={FIX_THECOACH_BLACK_20}
                  alt="img"
                  {...css(styles.menuItem)}
                />
              </div>
            </div>
          </Popup>
        )}
      </div>
    );
  }
);
