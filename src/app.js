import express from "express";
import userRouter from "./user/router.js";
import { dbConn } from "./db/instance.js";
import productRouter from "./products/router.js";

const app = express();

app.use(express.json());

//setting up the database connection
dbConn();

//users
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

export default app;
