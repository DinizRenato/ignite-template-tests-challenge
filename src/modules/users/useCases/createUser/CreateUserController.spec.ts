import request from 'supertest';

import { app } from '../../../../app';
import createConnection from '../../../../database';
import { Connection } from 'typeorm';

let connection: Connection;

describe('Create User Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  it('should be able to create a new user', async () => {

    const response = await request(app).post('/api/v1/users').send({
      name: 'UserTest',
      email: `user_email@finapi.com.br`,
      password: '123456'
    });

    expect(response.status).toBe(201);

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

});
