const ifIamOwnerRule = ({ conversation, swarmUser, currentUser }) => {
  return (
    conversation.workitem.ownerid === currentUser &&
    conversation.workitem.swarm === swarmUser.swarmid &&
    conversation.conv_starter === swarmUser.userid &&
    conversation.lastMessage_author !== currentUser
  );
};

const ifIamCreatorRule = ({ conversation, swarmUser, currentUser }) => {
  return (
    conversation.workitem.creatorid === currentUser &&
    conversation.workitem.ownerid === conversation.conv_starter &&
    conversation.workitem.swarm === swarmUser.swarmid &&
    conversation.conv_starter === swarmUser.userid &&
    conversation.lastMessage_author !== currentUser
  );
};

export const whoNeedsMyHelpConversation = ({
  conversation,
  swarmUser,
  currentUser,
}) => {
  return (
    ifIamOwnerRule({ conversation, swarmUser, currentUser }) ||
    ifIamCreatorRule({ conversation, swarmUser, currentUser })
  );
};
