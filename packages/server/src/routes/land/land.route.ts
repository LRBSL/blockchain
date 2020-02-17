import * as express from 'express';
import * as schemaValidator from 'express-joi-validator';
import landSchema from '../../constants/schema/land.schema';
import landController from '../../controllers/land.controller';

const router = express.Router();

router.post('/owner-verification/', schemaValidator(landSchema.ownerVerification), landController.ownerVerification);
router.post('/get-land-history/', schemaValidator(landSchema.getHistory), landController.getHistoryForLand);
router.post('/buyer-verification/', schemaValidator(landSchema.buyerVerifucation), landController.buyerVerification);
router.post('/change-notary-vote/', schemaValidator(landSchema.changeNotaryVote), landController.changeNotaryVote);
router.post('/get-deed', schemaValidator(landSchema.getDeed), landController.getDeedByLandId);
export default router;