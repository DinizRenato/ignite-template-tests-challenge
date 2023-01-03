import request from 'supertest';

import { app } from '../../../../app';
import { Connection } from "typeorm";
import createConnection from '../../../../database';

let connection: Connection;

describe('Show User Profile', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post('/api/v1/users').send({
      name: 'UserTest',
      email: `user_email@finapi.com.br`,
      password: '123456'
    });

  })

  it('should be able return user profile', async () => {

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: `user_email@finapi.com.br`,
      password: '123456'
    });

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    })

    expect(response.body).toMatchObject({
      name: 'UserTest',
      email: `user_email@finapi.com.br`
    });


  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

})
