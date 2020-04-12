'use strict';

const Helpers = use('Helpers');

const User = use('App/Models/User');

class ProfileController {
    async index({ request }) {
        const { page = 1, limit = 10 } = request.get();

        const users = await User.query()
            .select(['name', 'bio', 'avatar', 'email', 'created_at'])
            .paginate(page, limit);

        return users;
    }

    async store({ request, auth }) {
        const data = request.only([
            'name',
            'email',
            'password',
            'bio',
            'provider',
            'twitter'
        ]);

        const user = await User.create(data);

        const { token } = await auth.attempt(data.email, data.password);

        return { user, token };
    }

    async update({ request, auth }) {
        const data = request.only(['name', 'bio', 'email', 'twitter']);
        const avatar = request.file('avatar', {
            size: '4mb',
            types: ['image']
        });

        if (avatar) {
            await avatar.move(Helpers.tmpPath('uploads'), {
                name: `${new Date().getTime()}.${avatar.subtype}`,
                overwrite: true
            });

            if (!avatar.moved()) {
                return avatar.error();
            }

            data.avatar = avatar.fileName;
        }

        const user = await auth.getUser();

        user.merge(data);
        await user.save();

        return user;
    }
}

module.exports = ProfileController;
