'use strict';

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

/** @type {import('@adonisjs/vow/src/Suite')} */
const { test, trait, afterEach } = use('Test/Suite')('Auth');

trait('Test/ApiClient');
trait('Auth/Client');

afterEach(async () => await User.truncate());

const { createUser } = require('./utils/creators');

test('It should be able to create one user', async ({ client, assert }) => {
    const response = await client
        .post('/register')
        .send({
            name: 'Random name',
            email: 'random@email.com',
            password: '123123123',
            bio: 'Random bio'
        })
        .end();

    response.assertStatus(200);
    assert.exists(response.body.token);
});

test('It should be able to return JWT when user sign in', async ({
    client,
    assert
}) => {
    const password = '123123123';
    const email = 'test@email.com';
    await createUser({ password, email });

    const response = await client
        .post('/login')
        .send({ email, password })
        .end();

    response.assertStatus(200);
});
