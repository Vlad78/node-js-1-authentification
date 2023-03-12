import express from "express";
import { ValidationError, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { NewUser } from "../models/User.js";

// REGISTER

export const register = async (
  req: express.Request<{}, {}, NewUser>,
  res: express.Response<any | { errors: ValidationError[] | string[] }>
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const doc = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      accessType: req.body.accessType,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretKey",
      {
        expiresIn: "30d",
      }
    );

    const tempUser = user as any;
    const { password, ...rest } = tempUser._doc;

    res.status(200).json({ ...rest, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errors: ["Не удалось зарегистрироваться", e.message] });
  }
};

// LOGIN

export const login = async (
  req: express.Request<{}, {}, { email: string; password: string }>,
  res: express.Response<any | { errors: ValidationError[] | string[] }>
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ errors: ["Пользователь не найден"] });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: ["Пользователь не найден"] });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretKey",
      {
        expiresIn: "30d",
      }
    );

    const tempUser = user as any;
    const { password, ...rest } = tempUser._doc;

    res.status(200).json({ ...rest, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errors: ["Не удалось залогинится", e.message] });
  }
};

// AUTHME

export const authMe = async (
  req: express.Request<{}, {}, { userId: string }>,
  res: express.Response
) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(400).json({ errors: ["Пользователь не найден"] });
    }

    const tempUser = user as any;
    const { password, ...rest } = tempUser._doc;

    res.status(200).json({ ...rest });
  } catch (e) {
    console.log(e);
    res.status(500).json({ errors: ["Не удалось залогинится", e.message] });
  }
};
