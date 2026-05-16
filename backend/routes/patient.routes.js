const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

// Setup middleware
router.use(verifyToken);
router.use(verifyRole(['patient']));

// Book Appointment
router.post('/appointments', (req, res) => {
    const { doctor_id, department, appointment_date, appointment_time, priority } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !department || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate token number logic (e.g. ENT-101)
    const tokenPrefix = department.substring(0, 3).toUpperCase();
    
    db.get(`SELECT COUNT(*) as count FROM Appointments WHERE department = ? AND appointment_date = ?`, [department, appointment_date], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const tokenNum = row.count + 1;
        const tokenString = `${tokenPrefix}-${tokenNum.toString().padStart(3, '0')}`;

        db.run(`INSERT INTO Appointments (patient_id, doctor_id, department, appointment_date, appointment_time, token_number, priority) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [patient_id, doctor_id, department, appointment_date, appointment_time, tokenString, priority || 'Normal'], function(err) {
            
            if (err) return res.status(500).json({ message: 'Failed to book appointment' });
            
            const appointment_id = this.lastID;
            
            // Add to Queue
            db.run(`INSERT INTO Queue (appointment_id, department, token_number, waiting_time, current_status) VALUES (?, ?, ?, ?, ?)`,
                [appointment_id, department, tokenString, tokenNum * 15, 'Waiting'], (err) => {
                
                if (err) return res.status(500).json({ message: 'Failed to add to queue' });
                
                res.status(201).json({ message: 'Appointment booked successfully', token_number: tokenString, appointment_id });
            });
        });
    });
});

// View My Appointments
router.get('/appointments', (req, res) => {
    const patient_id = req.user.id;
    const query = `
        SELECT a.*, d.specialization, u.name as doctor_name, q.current_status as queue_status, q.waiting_time
        FROM Appointments a
        JOIN Doctors d ON a.doctor_id = d.doctor_id
        JOIN Users u ON d.user_id = u.id
        LEFT JOIN Queue q ON a.appointment_id = q.appointment_id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
    db.all(query, [patient_id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

module.exports = router;
