import { Router } from "express";
import { check } from "express-validator";
import { isValidBody } from "../roles/request.validation.js";
import { login, register, deposite, buy, reset, buyV2 } from "./controller.js";
import { isAuth } from "../roles/auth.js";

const userRouter = Router();

userRouter.post(
  "/register",
  [
    check("username", "Missing username").not().isEmpty(),
    check("password", "Missing username").not().isEmpty(),
    check("role", "Missing role").not().isEmpty(),
    isValidBody,
  ],
  register
);
userRouter.post(
  "/login",
  [
    check("username", "Missing username").not().isEmpty(),
    check("password", "Missing username").not().isEmpty(),
    isValidBody,
  ],
  login
);

userRouter.post(
  "/deposite",
  [
    check("uId", "Missing uId").not().isEmpty(),
    check("deposite", "Missing deposite").not().isEmpty(),
    isValidBody,
  ],
  isAuth,
  deposite
);

userRouter.post(
  "/:uId/buy",
  [
    check("uId", "Missing uId").not().isEmpty(),
    check("pAmount", "Missing pAmount").not().isEmpty(),
    check("pId", "Missing product id").not().isEmpty(),
    isValidBody,
  ],
  isAuth,
  buy
);

userRouter.post(
  "/:uId/buyv2",
  [check("products", "Missing products").not().isEmpty(), isValidBody],
  isAuth,
  buyV2
);

userRouter.post(
  "/:uId/reset",
  // [
  //   check("uId", "Missing uId").not().isEmpty(),
  //   check("pAmount", "Missing pAmount").not().isEmpty(),
  //   check("pIds", "Missing product ids").not().isEmpty(),
  //   isValidBody,
  // ],
  isAuth,
  reset
);

export default userRouter;
