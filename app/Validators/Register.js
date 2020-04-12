'use strict';

class Register {
    get rules() {
        return {
            email: 'required|email|unique:users,email',
            name: 'required',
            password: 'required'
        };
    }

    get messages() {
        return {
            required: 'É necessário preencher o campo de {{ field }}',
            unique: 'O campo {{ field }} já está cadastrado no sistema',
            email: 'O campo {{ field }} precisa conter um email válido'
        };
    }
}

module.exports = Register;
