const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const { Schema } = mongoose;

const productSchema = new Schema({
  imgSrc: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
});

const Product = mongoose.model("Product", productSchema);

//! Add new product
app.post("/products", async (req, res) => {
  try {
    const { imgSrc, title, price } = req.body;
    const product = new Product({
      imgSrc,
      title,
      price,
    });
    await product.save();

    res.status(201).send(product);
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

//! Get products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).send(products);
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

//! Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

//! Get product by Id
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

//! Update product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { imgSrc, title, price } = req.body;

    const findedProduct = await Product.findById(id);

    if (!findedProduct) {
      res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        imgSrc,
        title,
        price,
      },
      { new: true }
    );

    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

const PORT = process.env.PORT;
const DB = process.env.DB_URL;

mongoose.connect(DB).then(() => console.log("Connected!"));

app.listen(PORT, () => console.log("Port is up and running on the port", PORT));
