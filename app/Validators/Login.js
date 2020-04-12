'use strict';

class Login {
    get rules() {
        return {
            email: 'required|email|exists:users,email',
            password: 'required'
        };
    }

    get messages() {
        return {
            required: 'É necessário preencher o campo de {{ field }}',
            email: 'O campo {{ field }} precisa conter um email válido',
            exists: 'O {{ field }} não se encontra cadastrado no sistema'
        };
    }
}

module.exports = Login;
