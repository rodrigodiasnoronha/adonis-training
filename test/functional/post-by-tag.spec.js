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

const { createPost, createTag, createUser } = require('./utils/creators');

afterEach(async () => {
    await User.truncate();
    await Post.truncate();
    await Tag.truncate();
});

test('It should return every posts with a specific tag', async ({
    client,
    assert
}) => {
    const user = await createUser();

    const tag = await createTag({ slug: 'nfl', user_id: user.id });

    const post_1 = await createPost({ alias: 'post_1' });
    const post_2 = await createPost({ alias: 'post_2' });
    const post_3 = await createPost({ alias: 'post_3' });

    await post_1.tags().attach(tag.id);
    await post_2.tags().attach(tag.id);
    await post_3.tags().attach(tag.id);

    const response = await client
        .get(`/posts/tags`)
        .query({
            alias: tag.slug
        })
        .end();

    response.assertStatus(200);
});
