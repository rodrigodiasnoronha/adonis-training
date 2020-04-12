'use strict';

const { ServiceProvider } = require('@adonisjs/fold');

class CustomValidatorProvider extends ServiceProvider {
    /**
     * Register namespaces to the IoC container
     *
     * @method register
     *
     * @return {void}
     */
    register() {
        //
    }

    async existsFn(data, field, message, args, get) {
        const Database = use('Database');
        const value = get(data, field);
        if (!value) {
            /**
             * skip validation if value is not defined. `required` rule
             * should take care of it.
             */
            return;
        }

        const [table, column] = args;
        const row = await Database.table(table)
            .where(column, value)
            .first();

        if (!row) {
            throw message;
        }
    }

    /**
     * Attach context getter when all providers have
     * been registered
     *
     * @method boot
     *
     * @return {void}
     */
    boot() {
        const Validator = use('Validator');
        Validator.extend('exists', this.existsFn.bind(this));
    }
}

module.exports = CustomValidatorProvider;
