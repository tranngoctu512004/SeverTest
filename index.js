const express = require('express');
const port = 3500;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('./db');
require('./models/User');
const authRoutes = require('./routers/authRouter');
const requireToken = require('./MiddleWaves/AuthTokenRequired');
const exclusiveOfferRoutes = require('./routers/exclusiveRouter');
const bestSellingRoutes = require('./routers/bestSellingRouter');
const meetRoutes = require('./routers/meetRouter');
app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/exclusive', exclusiveOfferRoutes);
app.use('/selling', bestSellingRoutes);
app.use('/meet', meetRoutes);
app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
