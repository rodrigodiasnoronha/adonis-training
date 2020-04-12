'use strict';

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

class NewsController {
    async index({ params }) {
        const fiveLatestNews = await Post.query()
            .with('owner', builder => {
                builder.select(['id', 'name', 'avatar']);
            })
            .with('tags', builder => {
                builder.select(['id', 'title', 'slug']);
            })
            .orderBy('created_at', 'desc')
            .limit(5)
            .fetch();

        const mostViews = await Post.query()
            .with('owner', builder => {
                builder.select(['id', 'name', 'avatar']);
            })
            .with('tags', builder => {
                builder.select(['id', 'title', 'slug']);
            })
            .orderBy('views', 'desc')
            .limit(5)
            .fetch();

        const latest = await Post.query()
            .with('owner', builder => {
                builder.select(['id', 'name', 'avatar']);
            })
            .with('tags', builder => {
                builder.select(['id', 'title', 'slug']);
            })
            .orderBy('created_at', 'desc')
            .limit(10)
            .fetch();

        return { fiveLatestNews, mostViews, latest };
    }
}

module.exports = NewsController;
