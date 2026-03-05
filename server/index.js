import express from "express"
import cors from 'cors';
import morgan from 'morgan';
import db, { initDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Initialize Database
initDb();

// --- Clinicians ---
app.get('/api/clinicians', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clinicians');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/clinicians', async (req, res) => {
    const { name, specialization, age, phone, email } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        // Check if clinician already exists by email
        if (email) {
            const existing = await db.query('SELECT * FROM clinicians WHERE email = $1 or phone = $2', [email, phone]);
            if (existing.rowCount > 0) {
                return res.status(409).json({ error: 'Clinician with this email already exists' });
            }
        }

        const result = await db.query(
            'INSERT INTO clinicians (name, specialization, age, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, specialization, age, phone, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/clinicians/:id', async (req, res) => {
    const { id } = req.params;
    const { name, specialization, age, phone, email } = req.body;
    try {
        const result = await db.query(
            'UPDATE clinicians SET name = $1, specialization = $2, age = $3, phone = $4, email = $5 WHERE id = $6 RETURNING *',
            [name, specialization, age, phone, email, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Clinician not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/clinicians/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM clinicians WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Clinician not found' });
        res.json({ message: 'Clinician deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Patients ---
app.get('/api/patients', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM patients');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/patients', async (req, res) => {
    const {
        name, dob, gender, age, phone, email,
        city, zipcode, notes
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        // Check if patient already exists by email
        if (email) {
            const existing = await db.query('SELECT * FROM patients WHERE email = $1 or phone = $2', [email, phone]);
            if (existing.rowCount > 0) {
                return res.status(409).json({ error: 'Patient with this email already exists' });
            }
        }

        const result = await db.query(
            `INSERT INTO patients (
                name, dob, gender, age, phone, email, city, zipcode, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, dob, gender, age, phone, email, city, zipcode, notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, dob, gender, age, phone, email, city, zipcode, notes } = req.body;
    try {
        const result = await db.query(
            `UPDATE patients SET 
                name = $1, dob = $2, gender = $3, age = $4, phone = $5, 
                email = $6, city = $7, zipcode = $8, notes = $9 
            WHERE id = $10 RETURNING *`,
            [name, dob, gender, age, phone, email, city, zipcode, notes, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Patient not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM patients WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Patient not found' });
        res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Visits ---
app.get('/api/visits', async (req, res) => {
    const { clinicianId, patientId } = req.query;
    let query = `
        SELECT v.*, c.name as clinician_name, p.name as patient_name 
        FROM visits v
        JOIN clinicians c ON v.clinician_id = c.id
        JOIN patients p ON v.patient_id = p.id
    `;
    const params = [];

    if (clinicianId) {
        params.push(clinicianId);
        query += ` WHERE v.clinician_id = $${params.length}`;
    }
    if (patientId) {
        const operator = (clinicianId) ? 'AND' : 'WHERE';
        params.push(patientId);
        query += ` ${operator} v.patient_id = $${params.length}`;
    }

    query += ' ORDER BY v.timestamp DESC';

    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/visits', async (req, res) => {
    const { clinicianId, patientId, notes } = req.body;
    if (!clinicianId || !patientId) {
        return res.status(400).json({ error: 'clinicianId and patientId are required' });
    }

    try {
        const insertResult = await db.query(
            'INSERT INTO visits (clinician_id, patient_id, notes) VALUES ($1, $2, $3) RETURNING id',
            [clinicianId, patientId, notes]
        );

        const visitId = insertResult.rows[0].id;

        const newVisit = await db.query(`
            SELECT v.*, c.name as clinician_name, p.name as patient_name 
            FROM visits v
            JOIN clinicians c ON v.clinician_id = c.id
            JOIN patients p ON v.patient_id = p.id
            WHERE v.id = $1
        `, [visitId]);

        res.status(201).json(newVisit.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/visits/:id', async (req, res) => {
    const { id } = req.params;
    const { clinicianId, patientId, notes } = req.body;
    try {
        const result = await db.query(
            'UPDATE visits SET clinician_id = $1, patient_id = $2, notes = $3 WHERE id = $4 RETURNING *',
            [clinicianId, patientId, notes, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Visit not found' });

        // Fetch full details with names
        const updatedVisit = await db.query(`
            SELECT v.*, c.name as clinician_name, p.name as patient_name 
            FROM visits v
            JOIN clinicians c ON v.clinician_id = c.id
            JOIN patients p ON v.patient_id = p.id
            WHERE v.id = $1
        `, [id]);

        res.json(updatedVisit.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/visits/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM visits WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Visit not found' });
        res.json({ message: 'Visit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
