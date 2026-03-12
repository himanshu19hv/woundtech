import request from 'supertest';
import app from '../index.js';
import db from '../db.js';

jest.setTimeout(30000);

describe('Clinicians API', () => {
  let clinicianId;

  afterAll(async () => {
    if (clinicianId) {
      await db.query('DELETE FROM clinicians WHERE id = $1', [clinicianId]);
    }
  });

  it('should create a new clinician', async () => {
    const res = await request(app)
      .post('/api/clinicians')
      .send({
        name: 'Test Clinician',
        specialization: 'General',
        age: 40,
        phone: '1234567890',
        email: 'test@example.com'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    clinicianId = res.body.id;
  });

  it('should get all clinicians', async () => {
    const res = await request(app).get('/api/clinicians');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should update a clinician', async () => {
    const res = await request(app)
      .put(`/api/clinicians/${clinicianId}`)
      .send({
        name: 'Updated Clinician',
        specialization: 'Surgeon'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated Clinician');
  });

  it('should delete a clinician', async () => {
    const res = await request(app).delete(`/api/clinicians/${clinicianId}`);
    expect(res.statusCode).toEqual(200);
    clinicianId = null;
  });
});
