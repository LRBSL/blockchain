import * as express from 'express';
import { LandController_register_post, LandController_userLogin_post } from './user.controller';
import {
    LandController_queryLand_get,
    LandController_queryAllLands_get,
    LandController_registerRLR_post,
    LandController_registerNotary_post,
    LandController_registerSurveyor_post,
    LandController_getHistoryForLand_get,
    LandController_changeLandOwner_post,
    LandController_voteSurveyor_post,
    LandController_voteNotary_post,
    LandController_voteCurrentOwner_post,
    LandController_forkLand_post
} from './blockchain.controller';

export default express.Router()
    // .get('/land/query-land/:id', LandController_queryLand_get)
    // .get('/land/query-all-lands/', LandController_queryAllLands_get)
    // .get('/land/get-history-for-land/:id', LandController_getHistoryForLand_get)
    // .post('/land/change-land-owner/', LandController_changeLandOwner_post)
    // .post('/land/vote-surveyor/', LandController_voteSurveyor_post)
    // .post('/land/vote-notary/', LandController_voteNotary_post)
    // .post('/land/vote-current-owner/', LandController_voteCurrentOwner_post)
    // .post('/land/fork-land/', LandController_forkLand_post)
    // .post('/user/register-rlr/', LandController_registerRLR_post)
    // .post('/user/register-notary/', LandController_registerNotary_post)
    // .post('/user/register-surveyor/', LandController_registerSurveyor_post)
    // .post('/user/login/', LandController_login_post)
    // .post('/user/register/', LandController_register_post)
    .post('/user/login/', LandController_userLogin_post)