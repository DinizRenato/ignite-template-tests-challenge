import request from 'supertest';

import { app } from '../../../../app';
import { Connection } from "typeorm";
import createConnection from '../../../../database';

let connection: Connection;
let token = '';

describe('Create a new Statement', () => {

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

  it('should be able create a new statement [DEPOSIT]', async () => {

    await request(app).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'Deposit test'
      })
      .set({
        Authorization: `Bearer ${token}`
      }).expect(201);

  })

  it('should be able create a new statement [WITHDRAW]', async () => {

    await request(app).post('/api/v1/statements/withdraw')
      .send({
        amount: 50,
        description: 'Withdraw test'
      })
      .set({
        Authorization: `Bearer ${token}`
      }).expect(201);

  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

})
