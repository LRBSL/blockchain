import * as express from 'express';
import * as schemaValidator from 'express-joi-validator';
import userController from '../../controllers/user.controller';
import userSchema from '../../constants/schema/user.schema';

const router = express.Router();

router.post('/register/rlr/', schemaValidator(userSchema.registerRLR), userController.registerRLR);
router.post('/register/notary/', schemaValidator(userSchema.registerNotary), userController.registerNotary);
router.post('/register/surveyor/', schemaValidator(userSchema.registerSurveyor), userController.registerSurveyor);
router.post('/login/', schemaValidator(userSchema.login), userController.login);

export default router;