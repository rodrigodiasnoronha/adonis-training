'use strict';

class ChangePass {
    get rules() {
        return {
            token: 'required',
            password: 'required'
        };
    }

    get messages() {
        return {
            required: 'O campo {{ field }} é obrigatório'
        };
    }
}

module.exports = ChangePass;
