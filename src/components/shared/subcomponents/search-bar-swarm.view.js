import React from "react";
import { Dropdown } from "semantic-ui-react";
import "./search-bar.less";

export const SearchBarSwarm = ({ addSwarm }) => {
  const chosenSwarms = [
    {
      key: "FixPDQ",
      text: "FixPDQ",
      value: "FixPDQ",
      image: {
        avatar: true,
        src:
          "https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg",
      },
    },
    {
      key: "Swarm_1",
      text: "Swarm_1",
      value: "Swarm_1",
      image: {
        avatar: true,
        src:
          "https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg",
      },
    },
    {
      key: "Swarm_2",
      text: "Swarm_2",
      value: "Swarm_2",
      image: {
        avatar: true,
        src:
          "https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg",
      },
    },
    {
      key: "Swarm_3",
      text: "Swarm_3",
      value: "Swarm_3",
      image: {
        avatar: true,
        src:
          "https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg",
      },
    },
    {
      key: "Swarm_4",
      text: "Swarm_4",
      value: "Swarm_4",
      image: {
        avatar: true,
        src:
          "https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg",
      },
    },
  ];
  return (
    <Dropdown
      data-cy="swarm-search-temp-1"
      button
      className="icon searchBarClass"
      floating
      labeled
      icon="plus"
      options={chosenSwarms}
      search
      text="Search to add..."
      onChange={(event, data) => {
        // need to find a swarm in swarms using in the future....
        addSwarm(data.value);
      }}
    />
  );
};

export default SearchBarSwarm;
