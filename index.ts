import express from "express";
import mongoose from "mongoose";

import { registerValidator } from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

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

app.post("/register", registerValidator, UserController.register);

app.post("/login", UserController.login);

app.get("/authme", checkAuth, UserController.authMe);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// TODO затипизировать респонс
// TODO спрятать секретные ключи
// TODO разобраться с багом тс в 105 и 64
