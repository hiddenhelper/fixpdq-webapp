import React, { useContext, useEffect, useState } from "react";

import UserContext from "../user/context";
import { CardSelector } from "../workitems/workitems-card";
import HeaderDashboard from "../shared/header-dashboard";

const Home = (props) => {
  const context = useContext(UserContext);
  const isAuthenticated = context.user && context.user.username ? true : false;
  const [cardType, setCardType] = useState("PEOPLE");
  const [coachWorkitemList, setCoachWorkitemList] = useState([]);

  useEffect(()=>{
    if (props.location && props.location.state && props.location.state.cardType) {
      setCardType(props.location.state.cardType);
      setCoachWorkitemList(props.location.state.workitemIDList);
    } else {
      setCardType("PEOPLE");
      setCoachWorkitemList([]);
    }
  }, [props]);

  return (
    <>
      {isAuthenticated && (
        <>
          <HeaderDashboard
            cardType={cardType}
            setCardType={setCardType}
          />
          <CardSelector
            cardType={cardType}
            coachWorkitemList={coachWorkitemList}
          />
        </>
      )}
    </>
  );
};

export default Home;
