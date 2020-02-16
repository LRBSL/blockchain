import { Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserNotary } from './user.notary.entity';
import { AuthUser } from './user.auth.entity';

@Entity('user_rlr')
export class UserRLR extends User {
    constructor(user?: AuthUser, registeredId?: string, publicName?: string, contactNo?: string, postalAddress?: string,
        registeredAt?: Date, registeredNotaries?: UserNotary[]) {
        super();
        this.user = user;
        this.registeredId = registeredId;
        this.publicName = publicName;
        this.contactNo = contactNo;
        this.postalAddress = postalAddress;
        this.registeredAt = registeredAt;
        this.registeredNotaries = registeredNotaries;
    }

    @OneToMany(type => UserNotary, notary => notary.registeredRLR)
    registeredNotaries?: UserNotary[];
}