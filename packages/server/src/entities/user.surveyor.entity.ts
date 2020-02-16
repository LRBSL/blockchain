import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { LandPlan } from './land.plan.entity';
import { AuthUser } from './user.auth.entity';
import { NIC } from './nic.entity';

@Entity('user_surveyor')
export class UserSurveyor extends User {
    constructor(user?: AuthUser, registeredId?: string, publicName?: string, contactNo?: string, postalAddress?: string,
        registeredAt?: Date, firstName?: string, lastName?: string, nic?: NIC, plans?: LandPlan[]) {
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
        this.plans = plans;
    }

    @Column({ type: 'varchar', nullable: true })
    firstName?: string;

    @Column({ type: 'varchar', nullable: true })
    lastName?: string;

    @OneToOne(type => NIC)
    @JoinColumn()
    nic?: NIC;

    @OneToMany(type => LandPlan, plans => plans.registeredSurveyor)
    plans?: LandPlan[];
}