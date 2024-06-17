const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 10;

// Middleware to verify JWT token
const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' });
    }
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' });
        }
        const { _id } = payload;
        const user = await User.findById(_id);
        req.user = user;
        next();
    });
};

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).send({
            error: 'Please fill all fields'
        });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).send({
                error: 'Email đã được đăng ký'
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send({
            error: 'Failed to save user'
        });
    }
});
router.post('/logout', (req, res) => {
    // Kiểm tra xem cookie sessionToken có tồn tại hay không
    if (!req.cookies || !req.cookies.sessionToken) {
        return res.status(400).json({ message: 'Session token not found' });
    }

    // Lấy ra cookie sessionToken từ yêu cầu
    const sessionToken = req.cookies.sessionToken;
    console.log(sessionToken);

    // Xóa cookie sessionToken bằng cách ghi đè lên nó với giá trị rỗng và thời gian hết hạn ngay lập tức
    res.clearCookie('sessionToken', {
        httpOnly: true,
        sameSite: 'strict', // adjust as per your security requirements
        // secure: process.env.NODE_ENV === 'production' // recommended to be true in production
    });

    // Trả về một phản hồi JSON để thông báo rằng người dùng đã logout thành công
    res.json({ message: 'Logged out successfully' });
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send({
            error: 'Please fill all fields'
        });
    }
    try {
        const savedUser = await User.findOne({ $or: [{ email: email }, { phone: email }] });
        if (!savedUser) {
            return res.status(422).json({
                error: 'Tài khoản hoặc mật khẩu không hợp lệ'
            });
        }
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                console.log('Password match');
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
                res.send({ token });
            } else {
                console.log('Password does not match');
                return res.status(422).send({
                    error: 'Tài khoản hoặc mật khẩu không hợp lệ'
                });
            }
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send({
            error: err.message
        });
    }
});

// Add the /me route
router.get('/me', requireAuth, (req, res) => {
    res.send(req.user);
});

module.exports = router;
