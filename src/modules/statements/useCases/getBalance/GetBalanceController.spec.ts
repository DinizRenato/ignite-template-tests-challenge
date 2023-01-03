import request from 'supertest';

import { app } from '../../../../app';
import { Connection } from "typeorm";
import createConnection from '../../../../database';

let connection: Connection;
let token = '';

describe('Create User Controller', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post('/api/v1/users').send({
      name: 'UserTest',
      email: `user_email@finapi.com.br`,
      password: '123456'
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: `user_email@finapi.com.br`,
      password: '123456'
    });

    token = responseToken.body.token;

  });

  it('should be able return all statements from authenticated user', async () => {

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    })

    const { statement, balance } = response.body;

    expect(statement.length).toBe(0);
    expect(balance).toBe(0);

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

})
