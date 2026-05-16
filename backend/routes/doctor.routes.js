const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyToken, verifyRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.use(verifyRole(['doctor']));

// Get Doctor's Queue
router.get('/queue', (req, res) => {
    // First find doctor_id
    db.get('SELECT doctor_id, department FROM Doctors WHERE user_id = ?', [req.user.id], (err, doc) => {
        if (err || !doc) return res.status(404).json({ message: 'Doctor profile not found' });

        const date = new Date().toISOString().split('T')[0]; // Today's date

        const query = `
            SELECT q.*, a.appointment_time, a.priority, u.name as patient_name, u.id as patient_id
            FROM Queue q
            JOIN Appointments a ON q.appointment_id = a.appointment_id
            JOIN Users u ON a.patient_id = u.id
            WHERE a.doctor_id = ? AND a.appointment_date = ?
            ORDER BY 
                CASE a.priority WHEN 'Emergency' THEN 1 WHEN 'Urgent' THEN 2 ELSE 3 END,
                a.appointment_time ASC
        `;

        db.all(query, [doc.doctor_id, date], (err, rows) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json(rows);
        });
    });
});

// Update Queue Status
router.put('/queue/:queue_id/status', (req, res) => {
    const { queue_id } = req.params;
    const { status } = req.body; // 'In Progress', 'Completed', 'Skipped'

    if (!['Waiting', 'In Progress', 'Completed', 'Skipped'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    db.run('UPDATE Queue SET current_status = ? WHERE queue_id = ?', [status, queue_id], function(err) {
        if (err) return res.status(500).json({ message: 'Failed to update queue status' });
        
        // If completed or skipped, update appointment status as well
        if (status === 'Completed' || status === 'Skipped') {
            const apptStatus = status === 'Completed' ? 'Completed' : 'Pending';
            db.run('UPDATE Appointments SET status = ? WHERE appointment_id = (SELECT appointment_id FROM Queue WHERE queue_id = ?)', [apptStatus, queue_id]);
        }

        res.json({ message: 'Status updated successfully' });
    });
});

module.exports = router;
