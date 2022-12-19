import { useCallback, useEffect, useRef, useState } from "react";
import socketIO from "socket.io-client";

const SERVER_URL="http://localhost:4000"
const socket = socketIO.connect(SERVER_URL);

const Modal = ({ url }) => {
  const ref = useRef(null);
  const [image, setImage] = useState("");
  const [cursor, setCursor] = useState("");
  const [fullHeight, setFullHeight] = useState("");

  const keyPress = useCallback((e) => {
    console.log(e.code);
    socket.emit("keyPressed", {
      key: e.code,
    });
  });

  useEffect(() => {
    document.addEventListener("keypress", keyPress);
    return () => document.removeEventListener("keypress", keyPress);
  }, [keyPress]);

  useEffect(() => {
    socket.emit("browse", {
      url,
    });

    socket.on("image", ({ img, fullHeight }) => {
      // console.log(img);
      setImage("data:image/webp;base64," + img);
      setFullHeight(fullHeight);
    });

    socket.on("cursor", (cur) => {
      setCursor(cur);
    });
  }, []);

  const mouseMove = useCallback((event) => {
    const position = event.currentTarget.getBoundingClientRect();
    const widthChange = 1920 / position.width;
    const heightChange = 1080 / position.height;
    socket.emit("mouseMove", {
      x: widthChange * (event.pageX - position.left),
      y:
        heightChange *
        (event.pageY - position.top - document.documentElement.scrollTop),
    });
  }, []);

  const mouseClick = useCallback((event) => {
    const position = event.currentTarget.getBoundingClientRect();
    const widthChange = 1920 / position.width;
    const heightChange = 1080 / position.height;
    socket.emit("mouseClick", {
      x: widthChange * (event.pageX - position.left),
      y:
        heightChange *
        (event.pageY - position.top - document.documentElement.scrollTop),
    });
  }, []);

  const mouseScroll = useCallback((event) => {
    const position = event.currentTarget.scrollTop;
    socket.emit("scroll", {
      position,
    });
  }, []);

  return (
    <div className="popup" onScroll={mouseScroll}>
      <div
        ref={ref}
        className="popup-ref"
        style={{ cursor, height: fullHeight }}
      >
        {image && (
          <img src={image} onMouseMove={mouseMove} onClick={mouseClick} />
        )}
      </div>
    </div>
  );
};

export default Modal;
