import * as express from 'express';
import * as schemaValidator from 'express-joi-validator';
import userController from '../../controllers/user.controller';
import userSchema from '../../constants/schema/user.schema';
import { sendMail } from '../../controllers/utils.controller';

const router = express.Router();

router.post('/register', schemaValidator(userSchema.register), userController.register);
router.post('/register-notary', schemaValidator(userSchema.registerNotary), userController.registerNotary);
router.post('/login-backend', schemaValidator(userSchema.loginBackend), userController.loginBackend);
router.post('/login-blockchain-identity-name', 
schemaValidator(userSchema.loginBlockchain), userController.loginBlockchain_identityName);
router.post('/login-blockchain-identity-org', 
schemaValidator(userSchema.loginBlockchain), userController.loginBlockchain_identityOrg);
router.post('/login-blockchain', schemaValidator(userSchema.loginBlockchain), userController.loginBlockchain);
router.get('/me', userController.self);
router.get('/test', () => sendMail("ravindusachintha53@gmail.com", "Hello", "World"))

export default router;