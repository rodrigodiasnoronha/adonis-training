'use strict';

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Tag = use('App/Models/Tag');

/** @type {import('@adonisjs/vow/src/Suite')}  */
const { test, trait, afterEach } = use('Test/Suite')('Post By Tag');

trait('Test/ApiClient');

const { createPost, createUser } = require('./utils/creators');

afterEach(async () => {
    await Post.truncate();
    await User.truncate();
});

test('It should return a single post by its alias', async ({ client }) => {
    const user = await createUser();

    const post = await createPost({
        alias: 'unique-alias-test',
        user_id: user.id
    });

    const response = await client.get(`/posts/alias/${post.alias}`).end();

    response.assertStatus(200);
});
