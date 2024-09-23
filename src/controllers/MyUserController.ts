import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User({
      auth0Id: auth0Id.toString(),
      email: req.body.email.toString(),
    });

    await newUser.save();

    res.status(200).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, city, country } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;
    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({
      message: "Internal server error",
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({
      message: "Internal server error",
    });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
