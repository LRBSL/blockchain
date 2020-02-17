import * as express from 'express';

import userAuth from './user/auth.route';
import userInfo from './user/user.route';
import blockchain from './blockchain/blockchain.route';
import land from './land/land.route';

const router = express.Router();

router.use('/user/auth', userAuth);
router.use('/user/info', userInfo);
router.use('/blockchain', blockchain);
router.use('/land', land);

export default router;