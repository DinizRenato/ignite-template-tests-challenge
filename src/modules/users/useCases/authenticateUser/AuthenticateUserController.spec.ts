import request from 'supertest';

import { app } from '../../../../app';
import { Connection } from "typeorm";
import createConnection from '../../../../database';

let connection: Connection;

describe('Authenticate User', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post('/api/v1/users').send({
      name: 'UserTest',
      email: `user_email@finapi.com.br`,
      password: '123456'
    });

  })

  it('should be able return user and token JWT', async () => {

    const response = await request(app).post('/api/v1/sessions').send({
      email: `user_email@finapi.com.br`,
      password: '123456'
    });

    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toMatchObject({
      name: 'UserTest',
      email: `user_email@finapi.com.br`
    });

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

})
