/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { useContext, useEffect } from "react";
import "semantic-ui-less/semantic.less";
import { Loader } from "semantic-ui-react";
import { useConversations } from "../../hooks";
import { ConversationsContext } from "../../store/context";

export default (props) => {
  const { openConversationsLoading } = useContext(ConversationsContext);
  const {
    addParticipantsSuccess,
    openToastForAddParticipants,
  } = useConversations();
  useEffect(() => {
    openToastForAddParticipants();
  }, [addParticipantsSuccess]);
  return (
    <>
      <div>{props.children}</div>
      <div {...css(styles.loader)}>
        <Loader active={openConversationsLoading}>Opening conversations</Loader>
      </div>
    </>
  );
};

const styles = {
  loader: {
    position: "absolute",
    top: "50%",
    left: "40%",
    width: "400px",
  },
};
