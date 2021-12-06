import React, { memo, useState } from "react";
import { Placeholder } from "semantic-ui-react";

export const ImageOrPlaceholder = memo(({ avatar, defaultAvatar }) => {
  const [loaded, setLoaded] = useState(false);
  const onLoad = () => {
    setLoaded(true);
  };

  const imageStyle = loaded
    ? { height: "25px", width: "25px", borderRadius: "8px" }
    : { display: "none" };

  return (
    <div>
      <img
        className="ui image"
        alt={avatar}
        style={imageStyle}
        src={avatar ? avatar : defaultAvatar}
        onLoad={onLoad}
      />
      {!loaded && (
        <Placeholder style={{ height: 25, width: 25 }}>
          <Placeholder.Image />
        </Placeholder>
      )}
    </div>
  );
});
