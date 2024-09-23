import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import myUserRoute from "./routes/MyUserRoutes";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error: ", err));

app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
  res.send({
    message: "health OK!",
  });
});

app.use("/api/my/user", myUserRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
