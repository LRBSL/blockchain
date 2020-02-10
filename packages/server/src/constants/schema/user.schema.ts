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
    registerNotary: {
        body: {
            notary: {
                email: joi.string().email().required(),
                regId: joi.string().required(),
                fname: joi.string(),
                lname: joi.string(),
                nic: joi.string(),
            }
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