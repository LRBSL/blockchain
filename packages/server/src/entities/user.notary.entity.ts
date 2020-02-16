import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserRLR } from './user.rlr.entity';
import { NIC } from './nic.entity';
import { AuthUser } from './user.auth.entity';

@Entity('user_notary')
export class UserNotary extends User {
    constructor(user?: AuthUser, registeredId?: string, publicName?: string, contactNo?: string, postalAddress?: string,
        registeredAt?: Date, firstName?: string, lastName?: string, nic?: NIC, registeredRLR?: UserRLR) {
        super();
        this.user = user;
        this.registeredId = registeredId;
        this.publicName = publicName;
        this.contactNo = contactNo;
        this.postalAddress = postalAddress;
        this.registeredAt = registeredAt;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nic = nic;
        this.registeredRLR = registeredRLR;
    }

    @Column({ type: 'varchar', nullable: true })
    firstName?: string;

    @Column({ type: 'varchar', nullable: true })
    lastName?: string;

    @OneToOne(type => NIC)
    @JoinColumn()
    nic?: NIC;

    @ManyToOne(type => UserRLR, registeredRLR => registeredRLR.registeredNotaries)
    @JoinColumn()
    registeredRLR?: UserRLR;
}