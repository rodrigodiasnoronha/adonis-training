'use strict';

/** @type {import('@adonisjs/vow/src/Suite')}  */
const { test, trait, afterEach } = use('Test/Suite')('Provider');

trait('Test/ApiClient');
trait('Auth/Client');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

const { createUser } = require('./utils/creators');

afterEach(async () => {
    await User.truncate();
});

test('It should verify if user token is valid', async ({ client }) => {
    const user = await createUser({ email: 'myemail@email.com' });

    const response = await client
        .get('/verify_token')
        .loginVia(user, 'jwt')
        .end();

    response.assertStatus(204);
});
