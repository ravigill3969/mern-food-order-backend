import { Request, Response } from "express";
import cloudinary from "cloudinary";

import Restaurant from "../models/reastaurant";
import mongoose from "mongoose";

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

export default {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
};
