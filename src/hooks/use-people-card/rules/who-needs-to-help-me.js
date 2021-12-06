export const whoNeedsToHelpMeConversation = ({
  conversation,
  swarmUser,
  currentUser,
}) => {
  return (
    conversation.workitem.swarm === swarmUser.swarmid &&
    conversation.conv_starter === currentUser &&
    (conversation.workitem.creatorid === swarmUser.userid ||
      conversation.workitem.ownerid === swarmUser.userid) &&
    conversation.lastMessage_author === currentUser
  );
};
