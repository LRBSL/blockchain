import * as express from 'express';
import { LandController_login_post } from './user.controller';

export default express.Router()
.post('/user/login/', LandController_login_post)