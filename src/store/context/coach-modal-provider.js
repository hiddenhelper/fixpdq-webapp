import React, { useState } from "react";

export const CoachModalContext = React.createContext({
  openCoachModal: false,
});

export const CoachModalProvider = (props) => {
  const [openCoachModal, setOpenCoachModal] = useState(false);

  return (
    <CoachModalContext.Provider
      value={{
        openCoachModal,
        setOpenCoachModal,
      }}
    >
      {props.children}
    </CoachModalContext.Provider>
  );
};
