import React from "react";
import { Spin } from "antd";

const Loader = ({
  size = "large",
  fullScreen = false,
  tip = "Loading...",
  style = {},
}) => {
  const containerStyle = fullScreen
    ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        ...style,
      }
    : {
        display: "inline-flex",
        ...style,
      };

  return (
    <div style={containerStyle}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loader;
