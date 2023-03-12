import { body } from "express-validator";
import { AccessTypes } from "../models/User.js";

const emailMsg = "Incorrect email";
const passwordMsg = "Password is too short. Minimum 6 chars";
const nameMsg = "Name is too short. Minimum 3 chars";
const accessTypeMsg = `incorrect type. Available types: ${Object.values(AccessTypes)}`;
const avatarUrlMsg = "incorrect avatar url";

export const registerValidator = [
  body("email", emailMsg).isEmail(),
  body("password", passwordMsg).isLength({ min: 6 }),
  body("name", nameMsg).isLength({ min: 3 }),
  body("accessType", accessTypeMsg).custom((type) => Object.values(AccessTypes).includes(type)),
  body("avatarUrl", avatarUrlMsg).optional().isURL(),
];
