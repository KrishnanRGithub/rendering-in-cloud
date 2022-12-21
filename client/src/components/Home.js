import React, { useCallback, useState } from "react";
import Modal from "./Modal";
const VRAPP_URL="http://127.0.0.1:5500/VR-FYP/index.html"
const Home = () => {
  console.log("Launching the UI thing");
  const url = VRAPP_URL;
  return (
    <div>
        {<Modal show={true} url={url} />}
    </div>
  );
};

export default Home;
