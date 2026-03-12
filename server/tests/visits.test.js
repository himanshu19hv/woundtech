import request from 'supertest';
import app from '../index.js';
import db from '../db.js';

jest.setTimeout(30000);

describe('Visits API', () => {
  let clinicianId, patientId, visitId;

  beforeAll(async () => {
    const clinRes = await db.query(
      'INSERT INTO clinicians (name) VALUES ($1) RETURNING id',
      ['Visit Test Clinician']
    );
    clinicianId = clinRes.rows[0].id;

    const patRes = await db.query(
      'INSERT INTO patients (name, gender) VALUES ($1, $2) RETURNING id',
      ['Visit Test Patient', 'Male']
    );
    patientId = patRes.rows[0].id;
  });

  afterAll(async () => {
    if (visitId) await db.query('DELETE FROM visits WHERE id = $1', [visitId]);
    if (clinicianId) await db.query('DELETE FROM clinicians WHERE id = $1', [clinicianId]);
    if (patientId) await db.query('DELETE FROM patients WHERE id = $1', [patientId]);
  });

  it('create a new visit', async () => {
    const res = await request(app)
      .post('/api/visits')
      .send({
        clinicianId,
        patientId,
        notes: 'Initial visit'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    visitId = res.body.id;
  });

  it('get all visits', async () => {
    const res = await request(app).get('/api/visits');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
