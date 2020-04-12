'use strict';

class Post {
    get rules() {
        return {
            name: 'required',
            description: 'required',
            alias: 'required|unique:posts,alias',
            content: 'required'
        };
    }

    get messages() {
        return {
            required: 'O campo {{ field }} é requerido pela aplicação',
            unique: '{{ field }} já registrado no sistema'
        };
    }
}

module.exports = Post;
