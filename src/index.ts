import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import myUserRoute from "./routes/MyUserRoutes";
import myReastaurantRoute from "./routes/MyReastaurantRoute";
import reastaurantRoute from "./routes/Reastaurant";
import orderRoute from "./routes/OrderRoute";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error: ", err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send({
    message: "health OK!",
  });
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myReastaurantRoute);
app.use("/api/restaurant", reastaurantRoute);
app.use("/api/order", orderRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
