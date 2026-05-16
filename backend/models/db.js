const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK( role IN ('patient', 'doctor', 'admin') ) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Doctors (
            doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            specialization TEXT,
            department TEXT,
            city TEXT,
            location TEXT,
            hospital TEXT,
            availability BOOLEAN DEFAULT 1,
            FOREIGN KEY(user_id) REFERENCES Users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Appointments (
            appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor_id INTEGER,
            department TEXT,
            appointment_date DATE,
            appointment_time TEXT,
            token_number TEXT,
            priority TEXT CHECK( priority IN ('Normal', 'Urgent', 'Emergency') ) DEFAULT 'Normal',
            status TEXT CHECK( status IN ('Pending', 'Completed', 'Cancelled') ) DEFAULT 'Pending',
            FOREIGN KEY(patient_id) REFERENCES Users(id),
            FOREIGN KEY(doctor_id) REFERENCES Doctors(doctor_id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Queue (
            queue_id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_id INTEGER,
            department TEXT,
            token_number TEXT,
            waiting_time INTEGER DEFAULT 0,
            current_status TEXT CHECK( current_status IN ('Waiting', 'In Progress', 'Completed', 'Skipped') ) DEFAULT 'Waiting',
            date DATE DEFAULT CURRENT_DATE,
            FOREIGN KEY(appointment_id) REFERENCES Appointments(appointment_id)
        )`);

        // Insert default admin if not exists
        const bcrypt = require('bcryptjs');
        db.get("SELECT id FROM Users WHERE role = 'admin'", (err, row) => {
            if (!row) {
                const password = bcrypt.hashSync('admin123', 10);
                db.run("INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)", ['Admin User', 'admin@hospital.com', password, 'admin']);
                console.log('Default Admin user created (admin@hospital.com / admin123)');
            }
        });
    });
}

module.exports = db;
