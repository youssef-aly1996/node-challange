import Product from "./model.js";

//add new user with specified role
export const addProduct = async (req, res) => {
  try {
    const { productName, amountAvailable, cost } = req.body;
    const { sellerId } = req.params;

    if (!sellerId) return res.status(400).json("product without a seller");
    const product = new Product({
      productName,
      amountAvailable,
      cost,
      sellerId,
    });

    await product.save();

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

//get a specific product by id
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params.pId;
    if (!pId) return res.status(400).json("product not found");

    const product = await Product.findOne({ _id: productId }).exec();

    if (!product) return res.status(404).json("product not found");

    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

//update a product
export const updateProduct = async (req, res) => {
  try {
    //first we check if the updater is an exsiting seller
    const sellerId = req.body.userId;

    if (sellerId) {
      const { pId } = req.params;
      if (!pId) return res.status(400).json("product not found");
      const { productName, amountAvailable, cost } = req.body;

      const check = { productName, amountAvailable, cost };
      const update = {};

      for (const key in check) {
        if (check[key]) {
          update[key] = check[key];
        } else {
          continue;
        }
      }
      const filter = { _id: pId, sellerId };
      const product = await Product.findOneAndUpdate(filter, update, {
        new: true,
      });
      if (!product) return res.status(404).json("product not found");
      return res.status(201).json(product);
    } else {
      return res.status(404).json("you are not a real seller of this product");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

//delete a specific product by id
export const deleteProduct = async (req, res) => {
  try {
    //first we check if the updater is an exsiting seller
    const sellerId = req.body.userId;

    if (sellerId) {
      const { productId } = req.params.pId;
      if (!pId) return res.status(400).json("product not found");

      const product = await Product.findOneAndDelete({
        _id: productId,
        sellerId,
      }).exec();
      if (!product) return res.status(404).json("product not found");
      return res.status(201).json(product);
    } else {
      return res.status(404).json("you are not a real seller of this product");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};
