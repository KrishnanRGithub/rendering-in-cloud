const { join } = require("path");

const fs = require("fs").promises;

const sharp = require("sharp");

const imageProcessing = sharp();

i = 0;

const emptyFunction = async () => {};
const defaultAfterWritingNewFile = async (filename) =>
  console.log(`${i++} was written`);

class PuppeteerMassScreenshots {
  async init(page, socket, options = {}) {
    const runOptions = {
      beforeWritingImageFile: emptyFunction,
      afterWritingImageFile: defaultAfterWritingNewFile,
      beforeAck: emptyFunction,
      afterAck: emptyFunction,
      ...options,
    };
    // @ts-ignore
    this.socket = socket;
    // @ts-ignore
    this.page = page;
    // @ts-ignore
    this.client = await this.page.target().createCDPSession();
    // @ts-ignore
    this.canScreenshot = true;
    // @ts-ignore
    this.client.on("Page.screencastFrame", async (frameObject) => {
      // @ts-ignore
      if (this.canScreenshot) {
        await runOptions.beforeWritingImageFile();
        const filename = await this.writeImageFilename(frameObject.data);
        await runOptions.afterWritingImageFile(filename);
        try {
          await runOptions.beforeAck();
          // @ts-ignore
          await this.client.send("Page.screencastFrameAck", {
            sessionId: frameObject.sessionId,
          });
          await runOptions.afterAck();
        } catch (e) {
          // @ts-ignore
          this.canScreenshot = false;
        }
      }
    });
  }

  async writeImageFilename(data) {
    // var buf = Buffer.from(data, "base64"); // Ta-da
    // data = sharp(buf).webp({ nearLossless: true }).toBuffer();
    // data = Buffer.from(data, "binary").toString("base64");

    // data = sharp(buf).webp({ lossless: true }).toBuffer("output.webp");
    const fullHeight = await this.page.evaluate(() => {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
    });
    return this.socket.emit("image", { img: data, fullHeight });
  }

  async start(options = {}) {
    const startOptions = {
      format: "webp",
      quality: 60,
      everyNthFrame: 1,
      ...options,
    };
    try {
      // @ts-ignore
      await this.client?.send("Page.startScreencast", startOptions);
    } catch (err) {}
  }

  async stop() {
    try {
      // @ts-ignore
      await this.client?.send("Page.stopScreencast");
    } catch (err) {}
  }
}

module.exports = PuppeteerMassScreenshots;
