// models/exclusiveOffer.js

const mongoose = require('mongoose');

const bestSellingSchema = new mongoose.Schema({
  name: String,
  kilograms: String,
  photo: String, 
  price: Number,
  description: String
});

const BestSelling = mongoose.model('bestSelling', bestSellingSchema);

module.exports = BestSelling;
