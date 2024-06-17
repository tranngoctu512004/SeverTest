// routes/exclusiveOfferRoutes.js

const express = require('express');
const router = express.Router();
const BestSelling = require('../models/BestSelling');

// Get all exclusive offers
router.get('/getAll', async (req, res) => {
  try {
    const selling = await BestSelling.find();
    res.json(selling);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.get('/:id', getOffer, (req, res) => {
//   res.json(res.offer);
// });

// async function getOffer(req, res, next) {
//   try {
//     offer = await ExclusiveOffer.findById(req.params.id);
//     if (offer == null) {
//       return res.status(404).json({ message: 'Cannot find offer' });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }

//   res.offer = offer;
//   next();
// }

module.exports = router;
