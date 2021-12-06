/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { memo, useContext, useEffect, useState } from "react";
import { Dropdown, Image, Popup } from "semantic-ui-react";
import { usePayloadBuilderListView } from "../../../../hooks";
import { SwarmsContext } from "../../../../store/context";
import { default_avatar } from "../../../../utils/static-images";
import {
  generatePersonSelectorStyle,
  pickProperty,
} from "../../../../utils/user";
import { ImageOrPlaceholder } from "./image-or-placeholder";

export const OwnerAvatar = memo(
  ({
    workitemid,
    avatar,
    currentOwner,
    allUsers,
    onChangeOwner,
    updateLoading,
    swarmid,
    playbookid,
  }) => {
    const { assignStatusAction } = usePayloadBuilderListView();
    const [newOwner, setNewOwner] = useState(currentOwner);
    const { swarms } = useContext(SwarmsContext);
    const [usersList, setUsersList] = useState([]);

    const styles = {
      container: {
        width: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      buttons: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      button: {
        marginLeft: "5px !important",
      },
      dropdown: {
        width: "300px",
      },
      field: {
        backgroundColor: "#EFF3E0",
        borderRadius: "5px",
        border: "0 solid #EFF3E0",
        whiteSpace: "nowrap",
        maxWidth: "300px",
        overflow: "ellipses",
      },
    };

    const getSwarmUsers = async () => {
      const swarm = swarms.find((s) => s.swarmid === swarmid);
      if (swarm && allUsers) {
        const swarmUsers = swarm.users;
        swarmUsers.push({ userid: swarm.creatorid, userrole: "C" });
        swarmUsers.push({ userid: swarm.ownerid, userrole: "O" });

        let filterUsers = [];
        allUsers &&
          allUsers.forEach((user) => {
            if (swarmUsers.find((s) => s.userid === user.Username)) {
              filterUsers.push(user);
            }
          });

        const usersForDropdown = filterUsers
          .map((element) => {
            return {
              key: element.Username,
              value: element.Username,
              text: generatePersonSelectorStyle(element),
              image: {
                avatar: true,
                src: pickProperty(element, "picture") || default_avatar,
              },
            };
          })
          .sort((a, b) =>
            a.text.toLowerCase().localeCompare(b.text.toLowerCase())
          );
        setUsersList(usersForDropdown);
      }
    };

    useEffect(() => {
      getSwarmUsers();
    }, [swarms, allUsers]);

    const onOwnerChange = async (data) => {
      setNewOwner(data.value);
      const payload = assignStatusAction({
        owner: data.value,
        workitemid,
      });
      await onChangeOwner({ ...payload, workitemid });
    };

    const handleClose = () => {
      setNewOwner(currentOwner);
    };

    return (
      <>
        {!playbookid ? (
          <Popup
            on="click"
            onClose={handleClose}
            trigger={
              <div>
                {currentOwner ? (
                  <ImageOrPlaceholder
                    avatar={avatar}
                    defaultAvatar={default_avatar}
                  />
                ) : (
                  <Image
                    style={{
                      height: "25px",
                      width: "25px",
                      borderRadius: "8px",
                    }}
                    src={default_avatar}
                  />
                )}
              </div>
            }
            flowing
            hoverable
          >
            <div {...css(styles.container)}>
              <div {...css(styles.dropdown)}>
                <Dropdown
                  style={styles.field}
                  placeholder="Select Owner"
                  fluid
                  name={"owner"}
                  onChange={(e, data) => {
                    onOwnerChange(data);
                  }}
                  value={newOwner}
                  search
                  required
                  // disabled={updateLoading}
                  selection
                  options={usersList}
                  clearable
                />
              </div>
            </div>
          </Popup>
        ) : (
          <div>
            <ImageOrPlaceholder
              avatar={avatar}
              defaultAvatar={default_avatar}
            />
          </div>
        )}
      </>
    );
  }
);
