import * as joi from 'joi';

export default {
    registerRLR: {
        body: {
            email: joi.string().email().required(),
            password: joi.string().min(6).max(32).required(),
            type: joi.string().required(),
            registeredID: joi.string().required(),
            publicName: joi.string().required(),
            contactNo: joi.string().required(),
            postalAddress: joi.string().required()
        },
    },
    registerNotary: {
        body: {
            email: joi.string().email().required(),
            password: joi.string().min(6).max(32).required(),
            registeredID: joi.string().required(),
            publicName: joi.string().required(),
            contactNo: joi.string().required(),
            postalAddress: joi.string().required(),
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            nic: joi.string().required(),
            registeredRLR: joi.string().required()
        },
    },
    registerSurveyor: {
        body: {
            email: joi.string().email().required(),
            password: joi.string().min(6).max(32).required(),
            registeredID: joi.string().required(),
            publicName: joi.string().required(),
            contactNo: joi.string().required(),
            postalAddress: joi.string().required(),
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            nic: joi.string().required()
        },
    },
    login: {
        body: {
            email: joi.string().email().required(),
            password: joi.string().required(),
        },
    },

    getRLRUserInfo: {
        body: {
            id:  joi.string().required()
        }
    },

    register: {
        body: {
            email: joi.string().email().required(),
            password: joi.string().min(6).max(32).required(),
            type: joi.string().required(),
            regId: joi.string().required()
        },
    },
    // registerNotary: {
    //     body: {
    //         notary: {
    //             email: joi.string().email().required(),
    //             regId: joi.string().required(),
    //             fname: joi.string(),
    //             lname: joi.string(),
    //             nic: joi.string(),
    //         }
    //     },
    // },
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
    bcQueryLand: {
        body: {
            id: joi.string().required()
        },
    },
    bcQueryAllLands: {
        body: {
        },
    },
    getUserByNic: {
        body: {
            nic: joi.string().required()
        },
    }
};