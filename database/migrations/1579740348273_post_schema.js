'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PostSchema extends Schema {
    up() {
        this.create('posts', table => {
            table.increments();
            table.string('name').notNullable();
            table.string('description').notNullable();
            table.binary('content').notNullable();
            table.string('image');
            table.integer('views').defaultTo(0);
            table
                .string('alias')
                .unique()
                .notNullable();
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('SET NULL')
                .onUpdate('CASCADE');
            table.timestamps();
        });
    }

    down() {
        this.drop('posts');
    }
}

module.exports = PostSchema;
