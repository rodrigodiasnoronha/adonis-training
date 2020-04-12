'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Tag = use('App/Models/Tag');

class TagController {
    /**
     * Show a list of all tags.
     * GET tags
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request }) {
        const query = request.get();
        const page = query.page || 1;
        const limit = query.limit || 25;

        const tags = await Tag.query()
            .with('user', builder => builder.select(['id', 'name', 'avatar']))
            .orderBy('title', 'asc')
            .paginate(page, limit);

        return tags;
    }

    /**
     * Create/save a new tag.
     * POST tags
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, auth }) {
        const data = request.only(['title', 'slug']);

        const tag = await Tag.create({ ...data, user_id: auth.user.id });

        return tag;
    }

    /**
     * Display a single tag.
     * GET tags/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params }) {
        const tag = await Tag.findOrFail(params.id);

        await tag.load('user', builder =>
            builder.select(['id', 'name', 'bio', 'avatar'])
        );

        return tag;
    }

    /**
     * Update tag details.
     * PUT or PATCH tags/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        const data = request.only(['title', 'slug']);

        const tag = await Tag.findOrFail(params.id);
        const slug = await Tag.findBy('slug', data.slug);

        if (slug && slug.id !== tag.id) {
            response.status(400).json({ message: 'Slug already registered' });
        }

        await tag.merge({ ...data });
        await tag.save();

        return tag;
    }

    /**
     * Delete a tag with id.
     * DELETE tags/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params }) {
        const tag = await Tag.findOrFail(params.id);

        await tag.delete();
    }
}

module.exports = TagController;
