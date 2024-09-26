import { Request, Response } from "express";
import cloudinary from "cloudinary";

import Restaurant from "../models/reastaurant";
import mongoose from "mongoose";
import Order from "../models/order";

const getMyRestaurantOrder = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const reastaurant = await Restaurant.findOne({ user: req.userId });
    if (!reastaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    res.json(reastaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const newRestaurant = new Restaurant(req.body);
    newRestaurant.user = new mongoose.Types.ObjectId(req.userId);
    newRestaurant.imageUrl = imageUrl;
    newRestaurant.lastUpdated = new Date();

    await newRestaurant.save();

    res.status(201).send(newRestaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const reastaurant = await Restaurant.findOne({ user: req.userId });
    if (!reastaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    reastaurant.restaurantName = req.body.restaurantName;
    reastaurant.city = req.body.city;
    reastaurant.country = req.body.country;
    reastaurant.deliveryPrice = req.body.deliveryPrice;
    reastaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    reastaurant.cuisines = req.body.cuisines;
    reastaurant.menuItems = req.body.menuItems;
    reastaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      reastaurant.imageUrl = imageUrl;
    }

    await reastaurant.save();
    res.status(200).send(reastaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

  return uploadResponse.url;
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

  

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }
    console.log(restaurant)

    order.status = status;
    console.log(order)
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update order status" });
  }
};


export default {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrder,
  updateOrderStatus
};
