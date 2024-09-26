import express, { NextFunction, Request, Response } from "express";
import ReastaurantController from "../controllers/ReastaurantController";
import { param } from "express-validator";

const router = express.Router();

router.get("/:restaurantId", ReastaurantController.getRestaurant);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City must be a string"),
  ReastaurantController.searchRestaurant
);

export default router;
