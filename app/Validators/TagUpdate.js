'use strict';

class TagUpdate {
    get rules() {
        return {
            title: 'required',
            slug: 'required'
        };
    }

    get messages() {
        return {
            required: 'O campo {{ field }} é requerido'
        };
    }
}

module.exports = TagUpdate;
