const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Get all health workers — accessible to logged in patients
router.get('/healthworkers', protect, async (req, res) => {
    try {
        const workers = await User.find({ role: 'healthworker', isActive: true })
            .select('fullName email phone');
        res.status(200).json({ workers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;