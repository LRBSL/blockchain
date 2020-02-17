import * as express from 'express';
import * as schemaValidator from 'express-joi-validator';
import userController from '../../controllers/user.controller';
import userSchema from '../../constants/schema/user.schema';

const router = express.Router();

router.post('/rlr/get/', schemaValidator(userSchema.getRLRUserInfo), userController.getRLRUserInfo);

export default router;