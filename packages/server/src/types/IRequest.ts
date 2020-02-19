import { Request } from 'express';
import { AuthUser } from '../entities/user.auth.entity';

export default interface IRequest extends Request {
    user: AuthUser;
    dashboard: boolean;
}