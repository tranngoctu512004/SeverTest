// models/exclusiveOffer.js

const mongoose = require('mongoose');

const MeetSchema = new mongoose.Schema({
  name: String,
  kilograms: String,
  photo: String, 
  price: Number,
  description: String
});

const meet = mongoose.model('meet', MeetSchema);

module.exports = meet;
