const pino = require("pino");
const logger = pino({
  transport: {
    target: "pino-pretty",

    options: {
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

module.exports = logger;
