const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get all doctors (for patient booking form)
router.get('/doctors', (req, res) => {
    const { hospital } = req.query;
    let query = `
        SELECT d.doctor_id, d.specialization, d.department, u.name as doctor_name 
        FROM Doctors d 
        JOIN Users u ON d.user_id = u.id
        WHERE d.availability = 1
    `;
    const params = [];
    if (hospital) {
        query += ` AND d.hospital = ?`;
        params.push(hospital);
    }
    
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

// Get departments
router.get('/departments', (req, res) => {
    const { hospital } = req.query;
    let query = 'SELECT DISTINCT department FROM Doctors WHERE availability = 1';
    const params = [];
    if (hospital) {
        query += ' AND hospital = ?';
        params.push(hospital);
    }
    
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows.map(r => r.department));
    });
});

// Get cities
router.get('/cities', (req, res) => {
    db.all('SELECT DISTINCT city FROM Doctors WHERE availability = 1 AND city IS NOT NULL AND city != ""', (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows.map(r => r.city));
    });
});

// Get locations by city
router.get('/locations/:city', (req, res) => {
    db.all('SELECT DISTINCT location FROM Doctors WHERE availability = 1 AND city = ? AND location IS NOT NULL AND location != ""', [req.params.city], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows.map(r => r.location));
    });
});

// Get hospitals by location
router.get('/hospitals/:location', (req, res) => {
    db.all('SELECT DISTINCT hospital FROM Doctors WHERE availability = 1 AND location = ? AND hospital IS NOT NULL AND hospital != ""', [req.params.location], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows.map(r => r.hospital));
    });
});

// Get public queue status (optional feature for lobby screen)
router.get('/queue/live', (req, res) => {
    const date = new Date().toISOString().split('T')[0];
    const query = `
        SELECT q.department, q.token_number, q.current_status, d.department as doc_dept, u.name as doctor_name
        FROM Queue q
        JOIN Appointments a ON q.appointment_id = a.appointment_id
        JOIN Doctors d ON a.doctor_id = d.doctor_id
        JOIN Users u ON d.user_id = u.id
        WHERE q.date = ? AND q.current_status IN ('Waiting', 'In Progress')
        ORDER BY q.queue_id ASC
    `;
    db.all(query, [date], (err, rows) => {
         if (err) return res.status(500).json({ message: 'Database error' });
         res.json(rows);
    });
});

module.exports = router;
