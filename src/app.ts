import express from "express";
import http from "http";
import { setupSocketServer } from "./socket/io";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routers/userRouter";
import { connectToMongo } from "./config/db";

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);

connectToMongo();

app.use(express.json());
app.use(cors());


app.use("/user", userRouter);

setupSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
