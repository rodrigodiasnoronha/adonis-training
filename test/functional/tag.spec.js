'use strict';

const { test, trait, afterEach } = use('Test/Suite')('Tag');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');
const Tag = use('App/Models/Tag');

trait('Test/ApiClient');
trait('Auth/Client');

afterEach(async () => {
    await User.truncate();
    await Tag.truncate();
});

const { createUser } = require('./utils/creators');

test('It should be able to create a tag', async ({ client, assert }) => {
    const info = {
        title: 'nfl',
        slug: 'nfl'
    };

    const user = await createUser();

    const response = await client
        .post('/tags')
        .loginVia(user, 'jwt')
        .send(info)
        .end();

    response.assertStatus(200);
    assert.equal(response.body.title, info.title);
});

test('It should be able to return all tags', async ({ client }) => {
    const user = await createUser();
    await Tag.create({
        title: 'random title',
        slug: 'random-slug',
        user_id: user.id
    });

    const response = await client.get('/tags').end();

    response.assertStatus(200);
});

test('It should be able to update a tag (without slug edited)', async ({
    client,
    assert
}) => {
    const user = await createUser();
    const tag = await Tag.create({
        title: 'random title',
        slug: 'random-slug-1',
        user_id: user.id
    });

    const response = await client
        .put(`/tags/${tag.id}`)
        .loginVia(user, 'jwt')
        .send({ title: 'random title updated', slug: tag.slug })
        .end();

    response.assertStatus(200);
    assert.notEqual(tag.title, response.body.title, 'These fields are equal');
});

test('It should be able to update a tag (with slug edited)', async ({
    client,
    assert
}) => {
    const user = await createUser();
    const tag = await Tag.create({
        title: 'random title',
        slug: 'random-slug-1',
        user_id: user.id
    });

    const response = await client
        .put(`/tags/${tag.id}`)
        .loginVia(user, 'jwt')
        .send({ title: 'random title updated', slug: 'slug-edited' })
        .end();

    response.assertStatus(200);
    assert.notEqual(tag.title, response.body.title, 'These fields are equal');
});

test('It should be able to delete a tag', async ({ client }) => {
    const user = await createUser();

    const tag = await Tag.create({
        title: 'random title',
        slug: 'random-slug-1',
        user_id: user.id
    });

    const response = await client
        .delete(`/tags/${tag.id}`)
        .loginVia(user, 'jwt')
        .end();

    response.assertStatus(204);
});

test('It should be able to return unique tag', async ({ client, assert }) => {
    const user = await createUser();
    const tag = await Tag.create({
        title: 'random title',
        slug: 'random-slug-1',
        user_id: user.id
    });

    const response = await client.get(`/tags/${tag.id}`).end();

    response.assertStatus(200);
    assert.equal(response.body.title, tag.title, 'These field does not match');
});
