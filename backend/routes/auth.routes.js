const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['patient', 'doctor'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role for registration' });
    }

    try {
        const trimmedEmail = email.trim();
        db.get('SELECT id FROM Users WHERE email = ?', [trimmedEmail], (err, row) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (row) return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = bcrypt.hashSync(password, 10);

            db.run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, trimmedEmail, hashedPassword, role], function(err) {
                if (err) return res.status(500).json({ message: 'Database error' });
                
                const userId = this.lastID;
                if (role === 'doctor') {
                    const { specialization, department, city, location, hospital } = req.body;
                    db.run('INSERT INTO Doctors (user_id, specialization, department, city, location, hospital) VALUES (?, ?, ?, ?, ?, ?)', 
                           [userId, specialization || 'General', department || 'General', city || 'General', location || 'General', hospital || 'General'], (err) => {
                         if (err) console.error("Error creating doctor record:", err);
                    });
                }

                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const trimmedEmail = email.trim();
    console.log(`Login attempt for email: "${trimmedEmail}"`);
    
    db.get('SELECT * FROM Users WHERE email = ?', [trimmedEmail], (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!user) {
            console.log(`User not found for email: "${trimmedEmail}"`);
            return res.status(400).json({ message: 'Invalid credentials (User not found)' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            console.log(`Password mismatch for user: "${trimmedEmail}"`);
            return res.status(400).json({ message: 'Invalid credentials (Password mismatch)' });
        }
        
        console.log(`Successful login for user: "${trimmedEmail}"`);

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        if (user.role === 'doctor') {
            db.get('SELECT doctor_id, department, hospital FROM Doctors WHERE user_id = ?', [user.id], (err, doc) => {
                res.json({
                    token,
                    user: { id: user.id, name: user.name, role: user.role, email: user.email, doctor_id: doc?.doctor_id, department: doc?.department, hospital: doc?.hospital }
                });
            });
        } else {
             res.json({
                token,
                user: { id: user.id, name: user.name, role: user.role, email: user.email }
            });
        }
    });
});

module.exports = router;
