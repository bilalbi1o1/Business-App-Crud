var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ref: { type: String, required: true,unique: true },
  date: { type: Date, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneCell: { type: String, required: true },
  phoneHome: { type: String, required: true },
  employeeName: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  dateTime: { type: Date, required: true },
  remarks: { type: String },
  product: { type: String, required: true },
  issue: { type: String, required: true },
  imeiSn: { type: String, required: true },
  notes: { type: String },
  price: { type: Number, required: true }
});

const user = mongoose.model("user",userSchema);
module.exports = user;