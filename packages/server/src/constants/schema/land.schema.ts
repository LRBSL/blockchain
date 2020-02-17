import * as joi from 'joi';

export default {
    ownerVerification: {
        body: {
            userId: joi.string().required(),
            nic: joi.string().required(),
            key: joi.string().required()
        },
    },
    getHistory: {
        body: {
            userId: joi.string().required(),
            id: joi.string().required()
        },
    },
    buyerVerifucation: {
        body: {
            nic: joi.string().required()
        }
    },
    changeNotaryVote: {
        body: {
            newNicNo: joi.string().required(),
            userId: joi.string().required(),
            id: joi.string().required()
        }
    },
    getDeed: {
        body: {
            landId: joi.string().required()
        },
    }
};