import React, { useCallback, useState } from "react";
import Modal from "./Modal";
const VRAPP_URL="https://google.com"
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
