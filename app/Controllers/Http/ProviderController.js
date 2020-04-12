'use strict';

class ProviderController {
    async show({ response }) {
        return response.status(204).json();
    }
}

module.exports = ProviderController;
