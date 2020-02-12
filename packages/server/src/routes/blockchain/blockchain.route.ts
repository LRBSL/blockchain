import * as express from 'express';
import * as schemaValidator from 'express-joi-validator';
import userController from '../../controllers/user.controller';
import userSchema from '../../constants/schema/user.schema';
import logger from '../../config/logger';
import blockchainController from '../../controllers/blockchain.controller';

const router = express.Router();

router.post('/query-land', schemaValidator(userSchema.bcQueryLand), blockchainController.queryLand);
router.post('/query-all-lands', schemaValidator(userSchema.bcQueryAllLands), blockchainController.queryAllLands);
router.post('/get-history-for-land', schemaValidator(userSchema.bcQueryLand), blockchainController.getHistoryForLand);
// router.post('/register-notary', schemaValidator(userSchema.registerNotary), userController.registerNotary);
// router.post('/login-backend', schemaValidator(userSchema.loginBackend), userController.loginBackend);
// router.post('/login-blockchain-identity-name', 
// schemaValidator(userSchema.loginBlockchain), userController.loginBlockchain_identityName);
// router.post('/login-blockchain-identity-org', 
// schemaValidator(userSchema.loginBlockchain), userController.loginBlockchain_identityOrg);
// router.post('/login-blockchain', schemaValidator(userSchema.loginBlockchain), userController.loginBlochain);
// router.get('/me', userController.self);

export default router;