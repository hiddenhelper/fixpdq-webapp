import React from "react";
import {
  AuthProvider,
  ActionsProvider,
  WorkitemsProvider,
  SwarmsProvider,
  UsersProvider,
  CurrentSwarmProvider,
  WorkitemsNodesProvider,
  ConversationsProvider,
  CurrentPlaybookProvider,
  WorkitemsFilterProvider,
  TwilioProvider,
  WorkitemsCardFilterProvider,
  CoachModalProvider,
} from "./context";

const Store = (props) => {
  return (
    <AuthProvider>
      <TwilioProvider>
        <CurrentSwarmProvider>
          <WorkitemsCardFilterProvider>
            <WorkitemsFilterProvider>
              <CurrentPlaybookProvider>
                <WorkitemsProvider>
                  <WorkitemsNodesProvider>
                    <UsersProvider>
                      <SwarmsProvider>
                        <ConversationsProvider>
                          <CoachModalProvider>
                            <ActionsProvider>{props.children}</ActionsProvider>
                          </CoachModalProvider>
                        </ConversationsProvider>
                      </SwarmsProvider>
                    </UsersProvider>
                  </WorkitemsNodesProvider>
                </WorkitemsProvider>
              </CurrentPlaybookProvider>
            </WorkitemsFilterProvider>
          </WorkitemsCardFilterProvider>
        </CurrentSwarmProvider>
      </TwilioProvider>
    </AuthProvider>
  );
};

export default Store;
