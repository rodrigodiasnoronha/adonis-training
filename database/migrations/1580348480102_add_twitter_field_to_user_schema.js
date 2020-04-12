'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddTwitterFieldToUserSchema extends Schema {
    up() {
        this.alter('users', table => {
            table.string('twitter');
        });
    }

    down() {
        this.alter('users', table => {
            table.dropColumn('twitter');
        });
    }
}

module.exports = AddTwitterFieldToUserSchema;
