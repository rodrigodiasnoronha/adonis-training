'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

const Env = use('Env');

class Post extends Model {
    owner() {
        return this.belongsTo('App/Models/User');
    }

    tags() {
        return this.belongsToMany('App/Models/Tag');
    }

    static get computed() {
        return ['image_url'];
    }

    getImageUrl({ image }) {
        return `${Env.get('APP_URL')}/files/${image}`;
    }
}

module.exports = Post;
