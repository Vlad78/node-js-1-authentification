import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("It works");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
