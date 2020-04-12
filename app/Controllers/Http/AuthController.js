'use strict';

const User = use('App/Models/User');

class AuthController {
    async store({ request, auth }) {
        const data = request.only(['email', 'password']);

        const token = await auth.attempt(data.email, data.password);

        const user = await User.findByOrFail('email', data.email);
        return { user, token };
    }
}

module.exports = AuthController;
