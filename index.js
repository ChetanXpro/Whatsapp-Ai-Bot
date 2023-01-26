require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);
module.exports = openai;

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const { getChat, getImage } = require("./helper/openAi");
const logger = require("./helper/logger");
const client = new Client({ authStrategy: new LocalAuth() });

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  if (message.body.startsWith("/ask") || message.body.startsWith("/image")) {
    if (message.body.startsWith("/ask")) {
      const text = message.body?.replace("/ask", "")?.trim().toLowerCase();
      logger.info(`Chat: ${message.notifyName}:  ${text}`);
     
      if (text) {
        const res = await getChat(text);
        if (res) {
          message.reply(res.trim());
        }
      }
    } else if (
      message.body.startsWith("/image") ) {
      const text = message.body?.replace("/image", "")?.trim().toLowerCase();

      console.log(text);
      if (text) {
        const imageUrl = await getImage(text);
        const med = await MessageMedia.fromUrl(imageUrl);
        if (med) {
          message.reply(med);
        }
      }
    }
  }
});

client.initialize();
