import * as express from 'express';

import userAuth from './user/auth.route';
import blockchain from './blockchain/blockchain.route';
import land from './land/land.route';

import logger from '../config/logger';

const router = express.Router();

router.use('/user/auth', userAuth);
router.use('/blockchain', blockchain);
router.use('/land', land);

export default router;