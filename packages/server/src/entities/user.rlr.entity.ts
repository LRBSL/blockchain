import { Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserNotary } from './user.notary.entity';

@Entity('user_rlr')
export class UserRLR extends User {
    @OneToMany(type => UserNotary, notary => notary.registeredRLR)
    registeredNotaries?: UserNotary[];
}