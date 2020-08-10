import "./config";
import chalk from "chalk";
import path from "path";
import http from "http";
import express from "express";
import socketio from "socket.io";
import rateLimit from "express-rate-limit";
import { json } from "body-parser";
import cors from "cors";
import { CronJob } from "cron";

import { CONNECT, DISCONNECT } from "./events/event-names";
import { cleanStorage } from "./storage-clean-up";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDir = path.resolve(__dirname, "../public");
const storageDir = path.resolve(__dirname, "../storage");
const port = process.env.PORT;

const job = new CronJob("0 0 * * *", () => {
  console.log(chalk`{blue.bold [INFO] Running cronjob for storage clean up}`);
  cleanStorage(storageDir);
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(cors());
}

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(
    cors({
      origin: [
        "http://localhost:3001",
        "http://localhost:3000",
        process.env.MW_RETRO_DEV as string,
        process.env.MW_RETRO_PROD as string,
        process.env.RETRO_PUBLIC_PROD as string,
      ],
    })
  );
}

app.use(json());
app.use(express.static(publicDir));
app.use("/api/boards", apiLimiter);
// TODO: app.use("/api/boards", apiRouter);

// https://bit.ly/2wMAs0i
if (process.env.NODE_ENV === "PRODUCTION") {
  app.get("/*", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

io.on(CONNECT, (client) => {
  const roomId = client.handshake.query.boardId;

  client.join(roomId);
  client.on(DISCONNECT, () => {
    client.leave(roomId);
  });

  // TODO: boardEvents(io, client, roomId);
  // TODO: columnEvents(io, client, roomId);
  // TODO: cardEvents(io, client, roomId);
});

server.listen(port, () => {
  console.log(chalk`{blue.bold [INFO] Listening on ${port}}`);
  job.start();
  console.log(chalk`{blue.bold [INFO] Started cronjob}`);
});
