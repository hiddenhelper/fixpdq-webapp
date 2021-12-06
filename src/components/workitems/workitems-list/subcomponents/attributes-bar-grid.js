import { css } from "glamor";
import React, { memo } from "react";
import { Responsive } from "semantic-ui-react";
import { useWorkitemsList } from "../../../../hooks";
import { default_avatar } from "../../../../utils/static-images";
import { getUser } from "../../../../utils/user";
import { ImageOrPlaceholder } from "./image-or-placeholder";
import { LevelBar } from "./level-bar";
import { OwnerAvatar } from "./owner-avatar";
import { StatusAttribute } from "./status-attribute";

export const AttributesBarGrid = memo(
  ({ item, filter, allUsers, playbookid }) => {
    const { onChangeOwner, onChangeLevel, onChangeStatus, updateLoading } = useWorkitemsList();

    const creatorAvatar = getUser({
      userid: item.creatorid,
      allUsers,
    }).getPropertyValue("picture");
    const ownerAvatar = getUser({
      userid: item.ownerid,
      allUsers,
    }).getPropertyValue("picture");

    const styles = {
      bar: {
        display: "flex",
        alignItems: "center",
        "& > *": {
          padding: "0 10px 0 10px",
        },
      },
    };

    return (
      <Responsive minWidth={800}>
        <div {...css(styles.bar)}>
          {filter.ownerid.display && (
            <OwnerAvatar
              playbookid={playbookid}
              workitemid={item.workitemid}
              avatar={ownerAvatar ? ownerAvatar : default_avatar}
              currentOwner={item.ownerid}
              allUsers={allUsers}
              onChangeOwner={onChangeOwner}
              updateLoading={updateLoading}
              swarmid={item.swarm}
            />
          )}
          {filter.creator && (
            <div>
              <ImageOrPlaceholder
                avatar={creatorAvatar}
                defaultAvatar={default_avatar}
              />
            </div>
          )}
          {filter.status.values.length > 0 && (
            <div>
              <StatusAttribute item={item} playbookid={playbookid} onChangeStatus={onChangeStatus}/>
            </div>
          )}
          <div>
            <Responsive minWidth={1024}>
              {filter.priority && (
                <LevelBar
                  playbookid={playbookid}
                  title={"Priority"}
                  level={item.priority}
                  item={item}
                  onChangeLevel={onChangeLevel}
                  updateLoading={updateLoading}
                />
              )}
            </Responsive>
          </div>
          <div>
            <Responsive minWidth={1024}>
              {filter.difficulty && (
                <LevelBar
                  playbookid={playbookid}
                  title={"Difficulty"}
                  level={item.difficulty}
                  item={item}
                  onChangeLevel={onChangeLevel}
                  updateLoading={updateLoading}
                />
              )}
            </Responsive>
          </div>
          {/* <div>{`${item.workitemid.substr(0, 3)}-${
            item.next ? item.next.substr(0, 3) : "0"
          }`}</div> */}
        </div>
      </Responsive>
    );
  }
);
