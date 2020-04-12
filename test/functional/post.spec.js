'use strict';

/** @type {import('@adonisjs/vow/src/Suite')}  */
const { test, trait, afterEach } = use('Test/Suite')('Post');

trait('Test/ApiClient');
trait('Auth/Client');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Tag = use('App/Models/Tag');

const Helpers = use('Helpers');

const { createPost, createTag, createUser } = require('./utils/creators');

afterEach(async () => {
    await User.truncate();
    await Post.truncate();
    await Tag.truncate();
});

test('It should be able to create a single post without tags and with image', async ({
    client
}) => {
    const user = await createUser();

    const response = await client
        .post('/posts')
        .loginVia(user, 'jwt')
        .field('name', 'Post name (title)')
        .field('description', 'Post description')
        .field('content', 'Post content')
        .field('alias', 'unique-alias')
        .attach('image', Helpers.tmpPath('tests/post_image.jpg'))
        .end();

    response.assertStatus(200);
});

test('It should be able to create a single post without image and without tags', async ({
    client
}) => {
    const user = await createUser();

    const postInfo = {
        name: 'Random post name',
        description: 'Random post description',
        content: 'Random post content',
        alias: 'alias-aleatory'
    };

    const response = await client
        .post('/posts')
        .loginVia(user, 'jwt')
        .send(postInfo)
        .end();

    response.assertStatus(200);
});

test('It should be able to create a single post with tags and without image', async ({
    client
}) => {
    const user = await createUser();
    const tag_1 = await createTag({ slug: 'tag-1', user_id: user.id });
    const tag_2 = await createTag({ slug: 'tag-2', user_id: user.id });
    const tag_3 = await createTag({ slug: 'tag-3', user_id: user.id });

    const postInfo = {
        name: 'Random post name',
        description: 'Random post description',
        content: 'Random post content',
        alias: 'alias-aleatory',
        tags: `${tag_1.id}, ${tag_2.id}, ${tag_3.id}`
    };

    const response = await client
        .post('/posts')
        .loginVia(user, 'jwt')
        .send(postInfo)
        .end();

    response.assertStatus(200);
});

test('It should be able to return all posts', async ({ client }) => {
    const user = await createUser();

    await createPost({ alias: 'post_1', user_id: user.id });
    await createPost({ alias: 'post_2', user_id: user.id });
    await createPost({ alias: 'post_3', user_id: user.id });

    const response = await client.get('/posts').end();

    response.assertStatus(200);
});

test('It should be able to return an unique post', async ({ client }) => {
    const user = await createUser();

    const post = await createPost({ alias: 'post_1', user_id: user.id });

    const response = await client.get(`/posts/${post.id}`).end();

    response.assertStatus(200);
});

test('It should not be able to return a unique post, because its not found', async ({
    client
}) => {
    const postIdNotExists = 1232132;
    const response = await client.get(`/posts/${postIdNotExists}`).end();

    response.assertStatus(404);
});

test('It should be able to delete a single post', async ({ client }) => {
    const user = await createUser({ provider: true });

    const post = await createPost({ alias: 'post_1', user_id: user.id });

    const response = await client
        .delete(`/posts/${post.id}`)
        .loginVia(user, 'jwt')
        .end();

    response.assertStatus(204);
});

test('It should not be able to delete a single post, because user is inauthorized', async ({
    client
}) => {
    const user = await createUser();

    const post = await createPost({ alias: 'post_1', user_id: user.id });

    const response = await client
        .delete(`/posts/${post.id}`)
        .loginVia(user, 'jwt')
        .end();

    response.assertStatus(401);
});

test('It should be able to edit a single post', async ({ client, assert }) => {
    const user = await createUser({ provider: true });

    const post = await createPost({ name: 'Old name' });

    const response = await client
        .put(`/posts/${post.id}`)
        .loginVia(user, 'jwt')
        .field('name', 'new name')
        .field('description', 'description updated')
        .field('alias', 'alias_updated')
        .field('content', 'content updated')
        .attach('image', Helpers.tmpPath('tests/image_post_edited.png'))
        .end();

    response.assertStatus(200);

    assert.notEqual(
        response.body.name,
        post.name,
        'The fields need be different'
    );
});

test('It should be able to edit a single post with add tags', async ({
    client,
    assert
}) => {
    const user = await createUser({ provider: true });

    const tag_1 = await createTag({ slug: 'tag-1', user_id: user.id });
    const tag_2 = await createTag({ slug: 'tag-2', user_id: user.id });
    const tag_3 = await createTag({ slug: 'tag-3', user_id: user.id });

    const post = await createPost();

    const postInfo = {
        name: 'updated post name',
        description: 'updated post description',
        content: 'updated post content',
        alias: 'alias-aleatory',
        tags: `${tag_1.id}, ${tag_2.id}, ${tag_3.id}`
    };

    const response = await client
        .put(`/posts/${post.id}`)
        .loginVia(user, 'jwt')
        .send(postInfo)
        .end();

    response.assertStatus(200);
    assert.notEqual(
        response.body.name,
        post.name,
        'The fields need be different'
    );
});
