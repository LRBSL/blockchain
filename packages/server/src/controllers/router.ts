import * as express from 'express';
import { LandController_login_post, LandController_register_post } from './user.controller';

export default express.Router()
.post('/user/login/', LandController_login_post)
.post('/user/register/', LandController_register_post)