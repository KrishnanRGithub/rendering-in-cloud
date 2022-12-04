const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const puppeteer = require("puppeteer");
const PuppeteerMassScreenshots = require("./screen.shooter");
const PORT = 4000;
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let channelList = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("browse", async ({ url }) => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await page.goto(url);
    const screenshots = new PuppeteerMassScreenshots();
    await screenshots.init(page, socket);
    await screenshots.start();

    onKeyPressInBrowser = async ({ key }) => {
      console.log("Key Pressed", key);
      try {
        t = await page.keyboard.press(key);
      } catch (err) {
        console.log(err);
      }
    };

    onMouseMoveInBrowser = async ({ x, y }) => {
      try {
        await page.mouse.move(x, y);
        const cur = await page.evaluate(
          (p) => {
            const elementFromPoint = document.elementFromPoint(p.x, p.y);
            return window
              .getComputedStyle(elementFromPoint, null)
              .getPropertyValue("cursor");
          },
          { x, y }
        );

        socket.emit("cursor", cur);
      } catch (err) {}
    };

    onMouseClickInBrowser = async ({ x, y }) => {
      try {
        await page.mouse.click(x, y);
      } catch (err) {}
    };

    socket.on("keyPressed", onKeyPressInBrowser);

    socket.on("mouseMove", onMouseMoveInBrowser);

    socket.on("mouseClick", onMouseClickInBrowser);

    // socket.on("scroll", ({ position }) => {
    //   page.evaluate((top) => {
    //     window.scrollTo({ top });
    //   }, position);
    // });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
