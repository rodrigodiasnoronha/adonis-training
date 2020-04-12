'use strict';

const { test, trait, afterEach } = use('Test/Suite')('Forgot Pass (RESET)');

trait('Test/ApiClient');
trait('Auth/Client');

const User = use('App/Models/User');
const Token = use('App/Models/Token');

/** @type {import('@adonisjs/mail/src/Mail/Fake')}  */
const Mail = use('Mail');

const Env = use('Env');

const jwt = require('jsonwebtoken');

afterEach(async () => {
    await User.truncate();
    await Token.truncate();
});

const { createUser } = require('./utils/creators');

test('It should be able to send an email to user reset pass', async ({
    client
}) => {
    const email = 'random@email.com';
    await createUser({ email });

    Mail.fake();

    const response = await client
        .post('/reset_password')
        .send({ email })
        .end();

    Mail.restore();

    response.assertStatus(204);
});

test("It should be able to change user pass with email's token", async ({
    client
}) => {
    const email = 'test@email.com';
    const user = await createUser({ email });

    /**
     *
     * CASO VOCE MUDE O JEITO DE SALVAR O TOKEN NO BANCO NA HORA DE RESET DE SENHA E ISSO DÊ ERRO (esse teste),
     *
     * ADICIONE O MESMO MÉTODO QUE VOCE UTILIZOU NA HORA DE SALVAR O TOKEN PARA GERAR UM TOKEN IGUALMENTE AO DAQUI
     *
     *
     *
     */
    const token = jwt.sign({ id: user.id }, Env.get('JWT_SECRET'), {
        expiresIn: '10h'
    });

    const newPassword = 'pass_updated';

    const response = await client
        .put('/reset_password')
        .send({ password: newPassword, token })
        .end();

    response.assertStatus(200);
});
