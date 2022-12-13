import User from "./model.js";
import Product from "../products/model.js";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;

//import env variables
config();

//add new user with specified role
export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = new User({
      userName: username,
      password: hashedPass,
      role,
    });
    await user.save();
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

//login user with credentials
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ userName: username }).exec();
    if (!user) return res.status(404).json("user not found");
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("incorrect password");
    const token = sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json("internal server error");
  }
};

export const deposite = async (req, res) => {
  try {
    const { uId, deposite } = req.body;

    const depositAmounts = [2, 5, 10, 20, 50, 100];
    const amountIncluded = depositAmounts.includes(deposite);
    if (!amountIncluded) return res.status(400).json("bad deposite amount");
    const user = await User.findOneAndUpdate(
      { _id: uId, role: "buyer" },
      { $inc: { deposite: deposite } }
    ).exec();
    if (!user) return res.status(404).json("user not found");
    return res.status(200).json(`your ${deposite} deposite is successful`);
  } catch (error) {
    console.log(error);
    return res.status(400).json("internal server error");
  }
};

export const buy = async (req, res) => {
  try {
    const { uId } = req.params;
    const { pId, pAmount } = req.body;

    const user = await User.findOne({ _id: uId }).exec();
    const product = await Product.findOne({ _id: pId }).exec();

    if (!user || !product)
      return res.status(404).json("user or the product not found");

    const total = product.cost * pAmount;
    const balance = user.deposite;

    if (!balance > 0 && balance > total)
      return res.status(400).json("your balance is not enough");

    const change = balance - total;
    user.deposite = change;

    product.amountAvailable -= pAmount;

    await product.save();
    await user.save();
    return res.status(200).json({ total, product, change });
  } catch (error) {
    console.log(error);
    return res.status(400).json("internal server error");
  }
};

export const buyV2 = async (req, res) => {
  try {
    const { uId } = req.params;
    const { products } = req.body;
    const pIds = [];

    const user = await User.findOne({ _id: uId }).exec();
    if (!user) return res.status(404).json("user not found");
    const balance = user.deposite;

    for (const p of products) {
      pIds.push(Types.ObjectId(p.id));
    }
    const rows = await Product.aggregate([
      { $match: { _id: { $in: pIds } } },
      { $project: { productName: 1, cost: 1, amountAvailable: 1 } },
    ]);

    let total = 0;
    const updatedProducts = [];
    const failedProducts = [];

    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].amountAvailable < products[i].amount) {
          failedProducts.push({
            product: rows[i].productName,
            msg: `amount ${products[i].amount} of ${products[i].amount} is not available`,
          });
          rows.splice(i, 1);
          continue;
        }

        total += rows[i].cost * products[i].amount;
      }
    }
    if (balance && balance > total) {
      for (let i = 0; i < rows.length; i++) {
        const updatedProduct = await Product.findByIdAndUpdate(
          { _id: rows[i]._id },
          { $inc: { amountAvailable: -products[i].amount } },
          { projection: { productName: 1 } }
        );
        updatedProducts.push(updatedProduct);
      }
      user.deposite -= total;
      await user.save();
    } else {
      return res.status(400).json("your balance is not enough");
    }

    return res
      .status(200)
      .json({ yourProducts: updatedProducts, total, failedProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json("internal server error");
  }
};
