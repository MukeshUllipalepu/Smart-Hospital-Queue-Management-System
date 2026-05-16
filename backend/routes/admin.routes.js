const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.use(verifyRole(['admin']));

// Dashboard Analytics
router.get('/stats', (req, res) => {
    const stats = {};
    const date = new Date().toISOString().split('T')[0];

    db.serialize(() => {
        db.get('SELECT COUNT(*) as count FROM Users WHERE role = "patient"', (err, row) => {
            stats.total_patients = row?.count || 0;
            
            db.get('SELECT COUNT(*) as count FROM Users WHERE role = "doctor"', (err, row) => {
                stats.total_doctors = row?.count || 0;
                
                db.get('SELECT COUNT(*) as count FROM Appointments WHERE appointment_date = ?', [date], (err, row) => {
                    stats.today_appointments = row?.count || 0;
                    
                    db.get('SELECT COUNT(*) as count FROM Queue WHERE current_status = "Waiting" AND date = ?', [date], (err, row) => {
                        stats.waiting_queue = row?.count || 0;
                        res.json(stats);
                    });
                });
            });
        });
    });
});

// Manage Doctors
router.get('/doctors', (req, res) => {
    const query = `
        SELECT d.*, u.name, u.email 
        FROM Doctors d 
        JOIN Users u ON d.user_id = u.id
    `;
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

// Manage Patients
router.get('/patients', (req, res) => {
    db.all('SELECT id, name, email, created_at FROM Users WHERE role = "patient"', (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

module.exports = router;
