/* eslint-disable react-hooks/exhaustive-deps */
import { Auth } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import { Button, Image, Input, Table } from "semantic-ui-react";
import { updateUser } from "../../services/users";
import { UsersContext } from "../../store/context";
import { default_avatar } from "../../utils/static-images";
import { pickProperty } from "../../utils/user";
import UserContext, { withUserContext } from "../user/context";
import { LogOut } from "./logout";

import { isPushNotificationSupported, getUserSubscription, askUserPermission } from '../../services/notifications/helper';
import { saveSubscription } from "../../services/notifications/index";
import { toast } from "react-semantic-toasts";
import config from "../../amplify.config"
import clearLocalStorage from '../../functions/clear-local-storage';
var crypto = require("crypto");

export const Profile = (props) => {
  const [profile, setProfile] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    address: "",
    avatarURL: "",
    avatarData: null,
  });
  const [isRequestOnFlight, setIsRequestOnFlight] = useState(false);
  const [originalProfile, setOriginalProfile] = useState();
  const { users, success: usersLoadingSuccess, fetchUsersList } = useContext(
    UsersContext
  );
  const context = useContext(UserContext);
  const pushServerPublicKey = config.webApp.browserNotificationKey;
  const [userConsent, setUserConsent] = useState(Notification.permission);
  const [userSubscription, setUserSubscription] = useState(null);
  const isConsentGranted = userConsent === "granted";

  useEffect(() => {
    if (usersLoadingSuccess) {
      const user = users.find((s) => s.Username === context.user.username);
      if (user) {
        const initProfile = {
          userName: pickProperty(user, "nickname"),
          firstName: pickProperty(user, "given_name"),
          lastName: pickProperty(user, "family_name"),
          address: pickProperty(user, "address"),
          avatarURL: pickProperty(user, "picture"),
          avatarData: null,
        };
        setProfile(initProfile);
        setOriginalProfile(initProfile);

        const getExistingBrowserNotificationSubscription = async () => {
          const existingSubscription = await getUserSubscription();
          setUserSubscription(existingSubscription);
        };
        getExistingBrowserNotificationSubscription();
      }
    }
  }, [users]);

  const signOut = () => {
    clearLocalStorage();
    Auth.signOut()
      .then(() => {
        props.history.push("/auth");
      })
      .catch((error) => console.log("[logout]", error));
  };

  const getBase64Buffer = (data) => {
    let reader = new FileReader();
    const url = URL.createObjectURL(data);
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      setProfile({ ...profile, avatarURL: url, avatarData: reader.result });
    };
  };

  const updateProfile = async () => {
    try {
      setIsRequestOnFlight(true);
      const modifiedAvatarData = profile.avatarData
        ? {
            type: profile.avatarData.split(";")[0].split("/")[1],
            data: profile.avatarData.split("base64,")[1],
          }
        : null;
      let originalAvatarName = "";
      if (originalProfile && originalProfile.avatarURL) {
        const split_items = originalProfile.avatarURL.split("/");
        originalAvatarName = split_items[split_items.length - 1];
      }
      const requestBody = {
        nickname: profile.userName,
        firstname: profile.firstName,
        lastname: profile.lastName,
        address: profile.address,
        avatar: modifiedAvatarData,
        originalAvatar: originalAvatarName,
      };
      await updateUser(context.user.username, requestBody);
      await fetchUsersList();
      setIsRequestOnFlight(false);
    } catch (error) {
      console.log("update profile", error);
      setProfile(originalProfile);
      setIsRequestOnFlight(false);
    }
  };

  const createHash = (input) => {
    const md5sum = crypto.createHash("md5");
    md5sum.update(Buffer.from(input));
    return md5sum.digest("hex");
  }

  const onClickAskUserPermission = () => {
    askUserPermission().then(consent => {
      setUserConsent(consent);
      if (consent !== "granted") {
        toast({
          type: "error",
          icon: "user",
          title: "Consent denied",
          description: "You denied the consent to receive notifications",
          animation: "bounce",
          time: 5000,
        });
      }
    });
  };

  const onClickSubscribeToPushNotification = async () => {
    try {
      if (userConsent === "granted") {
        navigator.serviceWorker.ready
          .then(function (sw) {
            return sw.pushManager.getSubscription();
          })
          .then(function (pushSubscription) {
            return pushSubscription;
          });

        const serviceWorker = await navigator.serviceWorker.ready;
        const subscription = await serviceWorker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: pushServerPublicKey
        });
        setUserSubscription(subscription);
        const subscriptionString = JSON.stringify(subscription);
        const user = users.find((s) => s.Username === context.user.username);
        const subscriptionData = {
          personid: user.Username,
          subscriptionid: createHash(subscriptionString),
          subscription: subscription
        };

        await saveSubscription(subscriptionData)
        toast({
          type: "info",
          icon: "user",
          title: "Push Notification Subscription",
          description: "Successfully Subscribed to push notifications.",
          animation: "bounce",
          time: 5000,
        });
      }
    }
    catch (error) {
      toast({
        type: "error",
        icon: "user",
        title: "Subscription failed",
        description: "Something went wrong creating the subscriptions.",
        animation: "bounce",
        time: 5000,
      });
    }
  };

  return (
    <div>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">
              <h2>My Profile</h2>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Nickname:</Table.Cell>
            <Table.Cell>
              <Input
                data-cy="nickname-input"
                value={profile.userName}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    userName: e.target.value,
                  });
                }}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>First Name:</Table.Cell>
            <Table.Cell>
              <Input
                data-cy="first-name-input"
                value={profile.firstName}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    firstName: e.target.value,
                  });
                }}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Last Name:</Table.Cell>
            <Table.Cell>
              <Input
                data-cy="last-name-input"
                value={profile.lastName}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    lastName: e.target.value,
                  });
                }}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>City:</Table.Cell>
            <Table.Cell>
              <Input
                data-cy="location-input"
                value={profile.address}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    address: e.target.value,
                  });
                }}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>
              <Image
                src={profile.avatarURL ? profile.avatarURL : default_avatar}
                avatar
              />
            </Table.Cell>
            <Table.Cell>
              <input
                data-cy="profile-input-55250"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.target.files && event.target.files[0]) {
                    getBase64Buffer(event.target.files[0]);
                  }
                }}
              />
            </Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Notifications:</Table.Cell>
            <Table.Cell>
              <Table>
                <Table.Body>

                  <Table.Row>
                    <Table.Cell>
                      <span>&nbsp;Push notification is {!isPushNotificationSupported && "NOT"} supported by your device. &nbsp;&nbsp;</span>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span>&nbsp;Grant consent:&nbsp;</span>
                      <button disabled={!isPushNotificationSupported || isConsentGranted} onClick={onClickAskUserPermission}>
                        {isConsentGranted ? "Consent granted" : " Ask user permission"}
                      </button>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>
                      <span>&nbsp;Create Subscription:&nbsp;</span>
                      <button disabled={!isPushNotificationSupported || !isConsentGranted || userSubscription} onClick={onClickSubscribeToPushNotification}>
                        {userSubscription ? "Subscription created" : "Create Notification subscription"}
                      </button>
                    </Table.Cell>
                  </Table.Row>

                </Table.Body>
              </Table>

            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Email Notifications:</Table.Cell>
            <Table.Cell>
              <Input type="checkbox"
                     disabled
                     text="Enable Email Notifications"
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>SMS Notifications:</Table.Cell>
            <Table.Cell>
              <Input type="checkbox"
                     disabled
                     text="Enable SMS Notifications"
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <div>
        <Button
          data-cy="profile-save-button"
          onClick={updateProfile}
          disabled={isRequestOnFlight}
        >
          SAVE
        </Button>
        <LogOut signOut={signOut} isRequestOnFlight={isRequestOnFlight} />
      </div>
    </div>
  );
};

export default withUserContext(Profile);
