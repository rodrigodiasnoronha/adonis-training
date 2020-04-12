'use strict';

const User = use('App/Models/User');

const Post = use('App/Models/Post');

/** @type {import('@adonisjs/vow/src/Suite')}  */
const { test, trait, afterEach } = use('Test/Suite')('News');

trait('Test/ApiClient');

const { createUser, createPost } = require('./utils/creators');

afterEach(async () => {
    await User.truncate();
    await Post.truncate();
});

test('It should return recents, most viewest and latest posts', async ({
    client,
    assert
}) => {
    const user = await createUser();

    await createPost({ alias: 'uniqueasas-slug', user_id: user.id });
    await createPost({
        alias: 'unique-slug',
        user_id: user.id,
        views: 112312
    });
    await createPost({
        alias: 'uaaanique-slug',
        user_id: user.id,
        views: 12321
    });

    const response = await client.get('/news').end();

    response.assertStatus(200);
    assert.exists(response.body.fiveLatestNews);
    assert.exists(response.body.latest);
    assert.exists(response.body.mostViews);
});
