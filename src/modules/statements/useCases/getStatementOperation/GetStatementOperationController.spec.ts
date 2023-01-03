import request from 'supertest';

import { app } from '../../../../app';
import { Connection } from "typeorm";
import createConnection from '../../../../database';

let connection: Connection;
let token = '';

describe('Get Statement', () => {

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

  it('should be able to get a statement by ID', async () => {

    const responseStatement = await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'Deposit test'
      })
      .set({
        Authorization: `Bearer ${token}`
      });


    const { id } = responseStatement.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(responseStatement.body.id).toBe(response.body.id);
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

})
