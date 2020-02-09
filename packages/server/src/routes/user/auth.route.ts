import * as express from 'express';
import * as schemaValidator from 'express-joi-validator';
import userController from '../../controllers/user.controller';
import userSchema from '../../constants/schema/user.schema';

const router = express.Router();


router.post('/login', schemaValidator(userSchema.login), userController.login);
router.get('/me', userController.self);

export default router;