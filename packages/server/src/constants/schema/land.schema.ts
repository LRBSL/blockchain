import * as joi from 'joi';

export default {
    getIdByKeyNic: {
        body: {
            nic: joi.string().required(),
            key: joi.string().required()
        },
    },
    getDeed: {
        body: {
            landId: joi.string().required()
        },
    }
};