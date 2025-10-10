import React from "react";
import "./Background.css";

const Background: React.FC = () => {
  return (
    <div className="animated-background">
      <div className="gradient gradient1"></div>
      <div className="gradient gradient2"></div>
      <div className="gradient gradient3"></div>
      <div className="overlay"></div>
    </div>
  );
};

export default Background;
