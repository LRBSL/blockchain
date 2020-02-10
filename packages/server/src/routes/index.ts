import * as express from 'express';

import userAuth from './user/auth.route';
import logger from '../config/logger';

const router = express.Router();

router.use('/user/auth', userAuth);

export default router;