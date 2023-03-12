import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
  .connect("mongodb+srv://dssdom:wwwwww@cluster0.7xdu4do.mongodb.net/?retryWrites=true&w=majority")
  .then((res) => {
    console.log("BD connected successfully");
  })
  .catch((err) => {
    console.log("err", err);
  });

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("It works");
});

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
