'use strict';

/** @type {import('@adonisjs/vow/src/Suite')}  */
const { test, trait, afterEach } = use('Test/Suite')('Search');

trait('Test/ApiClient');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Tag = use('App/Models/Tag');

afterEach(async () => {
    await User.truncate();
    await Post.truncate();
    await Tag.truncate();
});

const { createUser, createTag, createPost } = require('./utils/creators');

test('It should return all posts with a search value', async ({
    client,
    assert
}) => {
    const user = await createUser();

    const tag_1 = await createTag({ slug: 'unique_slug_1' });
    const tag_2 = await createTag({ slug: 'unique_slug_2' });
    const tag_3 = await createTag({ slug: 'unique_slug_3' });

    const post = await createPost({
        name: 'post one',
        alias: 'unique_alias_1'
    });
    const post_2 = await createPost({
        name: 'post two',
        alias: 'unique_alias_2'
    });

    await post.tags().attach([tag_1.id, tag_2.id, tag_3.id]);
    await post_2.tags().attach([tag_1.id, tag_2.id, tag_3.id]);

    // PESQUISAR POR TODOS OS POSTS COM A PALAVRA "post" no seu título
    const response = await client
        .get('/search')
        .query({ query: 'post' })
        .end();

    response.assertStatus(200);
});
