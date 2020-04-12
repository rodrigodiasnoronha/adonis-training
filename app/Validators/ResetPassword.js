'use strict';

class ResetPassword {
    get rules() {
        return {
            email: 'required|email'
        };
    }

    get messages() {
        return {
            required: 'O campo {{ field }} é requerido',
            email: 'O campo {{ email }} precisa ser um e-mail válido',
            exists: '{{ field }} não encontrado'
        };
    }
}

module.exports = ResetPassword;
