'use strict';

const Helpers = use('Helpers');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

/** @type {import('@adonisjs/vow/src/Suite')}  */
const { test, trait, afterEach } = use('Test/Suite')('Profile');

trait('Auth/Client');
trait('Test/ApiClient');

afterEach(async () => await User.truncate());

const { createUser } = require('./utils/creators');

test('It should be able to update user profile', async ({ client }) => {
    const user = await createUser();

    const response = await client
        .put('/profile')
        .loginVia(user, 'jwt')
        .field('name', 'Updated name')
        .field('bio', 'Updated bio')
        .attach('avatar', Helpers.tmpPath('tests/profile.png'))
        .end();

    response.assertStatus(200);
});

test('It should be able to update user profile without profile pic', async ({
    client
}) => {
    const user = await createUser();

    const response = await client
        .put('/profile')
        .loginVia(user, 'jwt')
        .field('name', 'Updated name')
        .field('bio', 'Updated bio')
        .end();

    response.assertStatus(200);
});

test('it should be able to return all users', async ({ client, assert }) => {
    const user = await createUser({ email: 'user1@email.com' });
    await createUser({ email: 'user2@email.com' });

    const response = await client
        .get('/profiles')
        .loginVia(user, 'jwt')
        .end();

    response.assertStatus(200);
    assert.exists(response.body);
});
