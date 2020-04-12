'use strict';

/** @type {import('@adonisjs/lucid/src/Lucid/Model')}  */
const User = use('App/Models/User');

/** @type {import('@adonisjs/mail/src/Mail/Sender')}  */
const Mail = use('Mail');

/** @type {import('@adonisjs/framework/src/Env')}  */
const Env = use('Env');

const jwt = require('jsonwebtoken');

class ResetPasswordController {
    async store({ request }) {
        const data = request.only(['email']);

        const user = await User.findByOrFail('email', data.email);

        // TOKEN PARA RESET DE SENHA
        const token = jwt.sign({ id: user.id }, Env.get('JWT_SECRET'), {
            expiresIn: '10h'
        });

        // ARMAZENA O TOKEN DO USUÁRIO
        await user.tokens().create({ token, type: 'reset_password' });

        // URL PARA RECUPERAR SENHA
        const url = `${Env.get('FRONT_URL')}/reset?token=${token}`;

        //ENVIA O EMAIL
        await Mail.send(
            'emails.forgotpass',
            { url, name: user.name },
            message => {
                message
                    .to(data.email)
                    .from(`Defensor Saints <rodrigonoronha09@gmail.com>`)
                    .subject(`Recuperação de senha`);
            }
        );
    }

    async update({ request, response, auth }) {
        const data = request.only(['token', 'password']);

        return jwt.verify(
            data.token,
            Env.get('JWT_SECRET'),
            async (error, payload) => {
                if (error) {
                    return response
                        .status(400)
                        .json({ message: 'Token inválido' });
                }

                const user = await User.findOrFail(payload.id);

                user.password = data.password;

                await user.save();

                const token = await auth.attempt(user.email, data.password);

                return response.status(200).json({ user, token });
            }
        );
    }
}

module.exports = ResetPasswordController;
