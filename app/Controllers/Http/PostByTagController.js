'use strict';

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Tag = use('App/Models/Tag');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

class PostByTagController {
    async index({ request }) {
        const { page = 1, limit = 10, alias } = request.get();

        const tag = await Tag.findByOrFail('slug', alias);

        const posts = await tag
            .posts()
            .select([
                'id',
                'name',
                'description',
                'image',
                'views',
                'alias',
                'user_id'
            ])
            .with('tags', builder => {
                builder.select(['id', 'title', 'slug']);
            })
            .with('owner', builder => {
                builder.select(['id', 'name', 'avatar']);
            })
            .paginate(page, limit);

        return posts;
    }
}

module.exports = PostByTagController;
