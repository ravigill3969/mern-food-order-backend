import express, { NextFunction, Request, Response } from "express";
import multer from "multer";

import MyReastaurantController from "../controllers/MyReastaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
function test(req: Request, res: Response, next: NextFunction) {
  console.log(req.body);
  next();
}

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyReastaurantController.getMyRestaurantOrder
);
router.patch(
  "/order/:orderId/status",
 
  jwtCheck,
  jwtParse,
  MyReastaurantController.updateOrderStatus
);
router.get("/", jwtCheck, jwtParse, MyReastaurantController.getMyRestaurant);

router.post(
  "/",
  jwtCheck,
  jwtParse,
  // validateMyRestaurantRequest,
  upload.single("imageFile"),
  MyReastaurantController.createMyRestaurant
);

router.put(
  "/",
  test,
  jwtCheck,
  jwtParse,
  // validateMyRestaurantRequest,
  upload.single("imageFile"),
  MyReastaurantController.updateMyRestaurant
);

export default router;
