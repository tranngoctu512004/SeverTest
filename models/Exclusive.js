// models/exclusiveOffer.js

const mongoose = require('mongoose');

const exclusiveOfferSchema = new mongoose.Schema({
  name: String,
  kilograms: String,
  photo: String, 
  price: Number,
  description: String
});

const ExclusiveOffer = mongoose.model('ExclusiveOffer', exclusiveOfferSchema);

module.exports = ExclusiveOffer;
