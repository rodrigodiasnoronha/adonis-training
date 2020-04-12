'use strict';

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

class SearchController {
    async index({ request }) {
        const {
            page = 1,
            limit = 5,
            order = 'asc',
            query = ''
        } = request.get();

        const posts = await Post.query()
            .select([
                'name',
                'description',
                'id',
                'user_id',
                'image',
                'created_at',
                'alias'
            ])
            .where('name', 'like', `%${query}%`)
            .orWhere('description', 'like', `%${query}%`)
            .orderBy('created_at', order)
            .with('owner', builder => {
                builder.select(['id', 'name', 'avatar']);
            })
            .with('tags', builder => {
                builder.select(['id', 'title', 'slug']);
            })
            .paginate(page, limit);

        return posts;
    }
}

module.exports = SearchController;
