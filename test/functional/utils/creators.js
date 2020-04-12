/*
|--------------------------------------------------------------------------
|   Creators
|--------------------------------------------------------------------------
|
*/

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Tag = use('App/Models/Tag');

async function createUser(data) {
    return await User.create({
        name: 'random name',
        email: 'random@email.com',
        password: '123123123',
        bio: 'random bio',
        ...data
    });
}

async function createTag(data) {
    return await Tag.create({
        slug: 'random-slug',
        title: 'random title',
        ...data
    });
}

async function createPost(data) {
    return await Post.create({
        name: 'random name',
        description: 'random-description',
        alias: 'random-alias',
        content: 'random content',
        ...data
    });
}

module.exports = {
    createPost,
    createTag,
    createUser
};
