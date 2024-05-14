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



const PORT = process.env.PORT;
const DB = process.env.DB_URL;

mongoose.connect(DB).then(() => console.log("Connected!"));

app.listen(PORT, () => console.log("Port is up and running on the port", PORT));
