'use strict';

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

class AliasPostController {
    async show({ params }) {
        const post = await Post.findByOrFail('alias', params.alias);

        await post.load('owner');
        await post.load('tags');

        return post;
    }
}

module.exports = AliasPostController;
