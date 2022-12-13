import { Router } from "express";
import { check } from "express-validator";
import { isAuth } from "../roles/auth.js";
import { isValidBody } from "../roles/request.validation.js";
import { addProduct, updateProduct, deleteProduct } from "./controller.js";

const productRouter = Router();

productRouter.post(
  "/:sellerId/new",
  [
    check("productName", "Missing productName").not().isEmpty(),
    check("amountAvailable", "Missing amountAvailable").not().isEmpty(),
    check("cost", "Missing cost").not().isEmpty(),
    isValidBody,
  ],
  isAuth,
  addProduct
);
productRouter.put("/:pId/update", isAuth, updateProduct);

productRouter.delete("/:pId/delete", isAuth, deleteProduct);

export default productRouter;
