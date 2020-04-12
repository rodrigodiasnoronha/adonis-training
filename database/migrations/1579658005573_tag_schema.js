'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TagSchema extends Schema {
    up() {
        this.create('tags', table => {
            table.increments();
            table.string('title').notNullable();
            table
                .string('slug')
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
        this.drop('tags');
    }
}

module.exports = TagSchema;
