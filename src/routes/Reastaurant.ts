import express from "express";
import { param } from "express-validator";
import  ReastaurantController  from "../controllers/ReastaurantController";

const router = express.Router();

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
