const db = require('../config/db');

// Function 1: Get all doctors
exports.getDoctors = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM doctors ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Function 2: Get slots for a specific doctor
exports.getDoctorSlots = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM slots WHERE doctor_id = $1 ORDER BY start_time', 
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};