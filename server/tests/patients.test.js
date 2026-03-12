import request from 'supertest';
import app from '../index.js';
import db from '../db.js';

jest.setTimeout(30000);

describe('Patients API', () => {
  let patientId;

  afterAll(async () => {
    if (patientId) {
      await db.query('DELETE FROM patients WHERE id = $1', [patientId]);
    }
  });

  it('create a new patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({
        name: 'Test Patient',
        dob: '1990-01-01',
        gender: 'Male',
        age: 34,
        phone: '0987654321',
        email: 'patient@example.com'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    patientId = res.body.id;
  });

  it('get all patients', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('delete a patient', async () => {
    const res = await request(app).delete(`/api/patients/${patientId}`);
    expect(res.statusCode).toEqual(200);
    patientId = null;
  });
});
