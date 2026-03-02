import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const db = new Pool({
  connectionString: process.env.DATABASE_CONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const initDb = async () => {
  try {
    await db.query(`
            CREATE TABLE IF NOT EXISTS clinicians (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                specialization TEXT,
                age INTEGER,
                phone TEXT,
                email TEXT
            );

            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                dob TEXT,
                gender TEXT,
                age INTEGER,
                phone TEXT,
                email TEXT,
                city TEXT,
                zipcode TEXT,
                notes TEXT
            );

            CREATE TABLE IF NOT EXISTS visits (
                id SERIAL PRIMARY KEY,
                clinician_id INTEGER REFERENCES clinicians(id),
                patient_id INTEGER REFERENCES patients(id),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                notes TEXT
            );
        `);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

export default db;
