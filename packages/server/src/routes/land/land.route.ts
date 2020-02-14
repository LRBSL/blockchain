import * as express from 'express';
import * as schemaValidator from 'express-joi-validator';
import landSchema from '../../constants/schema/land.schema';
import landController from '../../controllers/land.controller';

const router = express.Router();

router.post('/get-id-by-key-nic', schemaValidator(landSchema.getIdByKeyNic), landController.getLandIdFromLandMap);
router.post('/get-deed', schemaValidator(landSchema.getDeed), landController.getDeedByLandId);
export default router;