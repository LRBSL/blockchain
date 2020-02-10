import * as joi from 'joi';

export default {
    register: {
        body: {
            email: joi.string().email().required(),
            password: joi.string().min(6).max(32).required(),
            type: joi.string().required(),
            regId: joi.string().required()
        },
    },
    loginBackend: {
        body: {
            email: joi.string().email().required(),
            password: joi.string().required(),
        },
    },
    loginBlockchain: {
        body: {
        },
    },
    update: {
        body: {

        },
    },
};