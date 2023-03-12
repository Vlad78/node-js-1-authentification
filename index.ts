import express from "express";
import { ValidationError, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User, { NewUser } from "./models/User.js";
import { registerValidator } from "./validation/auth.js";

const app = express();
app.use(express.json());

// BD CONNECT

mongoose
  .connect(
    "mongodb+srv://dssdom:wwwwww@cluster0.7xdu4do.mongodb.net/users?retryWrites=true&w=majority"
  )
  .then((res) => {
    console.log("BD connected successfully");
  })
  .catch((err) => {
    console.log("err", err);
  });

// REGISTER

app.post(
  "/register",
  registerValidator,
  async (
    req: express.Request<{}, {}, NewUser>,
    res: express.Response<any | { errors: ValidationError[] | any }>
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

      const { password, ...userData } = user;

      res.status(200).json({ ...userData, token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ errors: ["Не удалось зарегистрироваться", e.message] });
    }
  }
);

app.post("/login", (req, res) => {
  const token = jwt.sign(
    {
      email: req.body.email,
      password: req.body.password,
    },
    "secretKey"
  );
  console.log(req.body);

  res.json({
    token: token,
    email: req.body.email,
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
