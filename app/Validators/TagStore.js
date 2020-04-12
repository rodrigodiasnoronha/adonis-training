'use strict';

class TagStore {
    get rules() {
        return {
            title: 'required',
            slug: 'required|unique:tags,slug'
        };
    }

    get messages() {
        return {
            required: 'O campo {{ field }} é requerido',
            unique: 'O campo {{ field }} já está cadastrado no sistema'
        };
    }
}

module.exports = TagStore;
