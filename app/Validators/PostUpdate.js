'use strict';

class PostUpdate {
    get rules() {
        return {
            name: 'required',
            description: 'required',
            alias: 'required',
            content: 'required'
        };
    }

    get messages() {
        return {
            required: 'O campo {{ field }} é requerido pela aplicação'
        };
    }
}

module.exports = PostUpdate;
