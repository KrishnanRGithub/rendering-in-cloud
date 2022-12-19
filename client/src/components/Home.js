import React, { useCallback, useState } from "react";
import Modal from "./Modal";
const VRAPP_URL="https://google.com"
const Home = () => {
  console.log("aaaa");
  const [url, setURL] = useState(VRAPP_URL);
  const [show, setShow] = useState(true);
  const handleCreateChannel = useCallback(() => {
    setShow(true);
  }, []);
  return (
    <div>
      <div className="home__container">
        <h2>URL</h2>
        <form className="form">
          <label>Provide a URL</label>
          <input
            type="url"
            name="url"
            id="url"
            className="form__input"
            required
            value={url}
            onChange={(e) => setURL(e.target.value)}
          />
        </form>
        <button className="createChannelBtn" onClick={handleCreateChannel}>
          BROWSE
        </button>
        {show && <Modal show={show} url={url} />}
      </div>
    </div>
  );
};

export default Home;
