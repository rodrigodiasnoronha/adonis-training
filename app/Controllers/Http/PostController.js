'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Post = use('App/Models/Post');

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const Tag = use('App/Models/Tag');

class PostController {
    /**
     * Show a list of all posts.
     * GET posts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request }) {
        const query = request.get();
        const page = query.page || 1;
        const limit = query.limnit || 10;

        const posts = await Post.query()
            .select([
                'id',
                'name',
                'description',
                'image',
                'alias',
                'created_at',
                'user_id',
                'views'
            ])
            .with('tags', builder => {
                builder.select(['id', 'title', 'slug']);
            })
            .with('owner', builder => {
                builder.select(['id', 'name', 'avatar']);
            })
            .orderBy('created_at', 'desc')
            .paginate(page, limit);

        return posts;
    }

    /**
     * Create/save a new post.
     * POST posts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, auth }) {
        const data = request.only(['name', 'description', 'alias', 'content']);
        const { tags } = request.only(['tags']);

        const image = request.file('image', {
            types: ['image'],
            size: '5mb'
        });

        if (image) {
            await image.move(Helpers.tmpPath('uploads'), {
                name: `${new Date().getTime()}-${(
                    Math.random(0, 1) * 1000
                ).toFixed(0)}.${image.subtype}`,
                overwrite: true
            });

            if (!image.moved()) {
                return image.error();
            }

            data.image = image.fileName || null;
        }

        const post = await Post.create({ ...data, user_id: auth.user.id });

        // REGISTRA AS TAGS NO POST
        if (tags && tags.length > 0) {
            /**
             *
             * MESMO SE VOCÊ ENVIAR UM ARRAY NA REQUISIÇÃO, ELE É RETORNADO COMO UMA STRING
             *
             */
            const tagsArray = tags.split(',').map(tag => tag.trim());

            await post.tags().attach(tagsArray);
        }

        await post.load('owner', builder => {
            builder.select(['id', 'name', 'avatar']);
        });

        await post.load('tags', builder => {
            builder.select('id', 'title', 'slug');
        });

        return post;
    }

    /**
     * Display a single post.
     * GET posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request }) {
        const post = await Post.findOrFail(params.id);

        const addMoreOneView = parseInt(post.views) + 1;
        await post.merge({ views: addMoreOneView });

        console.log(post);
        await post.save();

        await post.load('owner', builder => {
            builder.select(['id', 'name', 'avatar']);
        });

        await post.load('tags', builder => {
            builder.select('id', 'title', 'slug');
        });

        return post;
    }

    /**
     * Update post details.
     * PUT or PATCH posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response, auth }) {
        const data = request.only(['name', 'description', 'content', 'alias']);
        const { tags } = request.only(['tags']);

        const user = await auth.getUser();

        if (!user.provider) {
            return response
                .status(401)
                .json({ message: 'Unauthorized request 401', code: 401 });
        }

        const post = await Post.findOrFail(params.id);

        const image = request.file('image', {
            types: ['image'],
            size: '5mb'
        });

        if (image && post.image !== image.fileName) {
            await image.move(Helpers.tmpPath('uploads'), {
                name: `${new Date().getTime()}-${(
                    Math.random(0, 1) * 1000
                ).toFixed(0)}.${image.subtype}`,
                overwrite: true
            });

            if (!image.moved()) {
                return image.error();
            }

            data.image = image.fileName || post.image || null;
        }

        if (data.alias !== post.alias) {
            const aliasExists = await Post.query()
                .where('alias', '=', data.alias)
                .first();

            if (aliasExists && aliasExists.id !== post.id) {
                return response
                    .status(400)
                    .json({ message: 'Esse alias já existe' });
            }
        }

        await post.merge(data);
        await post.save();

        if (tags && tags.length > 0) {
            const arrayTags = tags.split(',').map(t => t.trim());
            await post.tags().sync(arrayTags);
        }

        return post;
    }

    /**
     * Delete a post with id.
     * DELETE posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response, auth }) {
        const user = await auth.getUser();

        if (!user.provider) {
            return response
                .status(401)
                .json({ message: 'Unauthorized 401', code: 401 });
        }

        const post = await Post.findOrFail(params.id);

        await post.delete();
    }
}

module.exports = PostController;
