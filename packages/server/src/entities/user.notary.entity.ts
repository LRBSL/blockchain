import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserRLR } from './user.rlr.entity';
import { NIC } from './nic.entity';

@Entity('user_notary')
export class UserNotary extends User {
    @Column({ type: 'varchar', nullable: true })
    firstName?: string;

    @Column({ type: 'varchar', nullable: true })
    lastName?: string;

    @OneToOne(type => NIC)
    @JoinColumn()
    nic?: NIC;

    @ManyToOne(type => UserRLR, registeredRLR => registeredRLR.registeredNotaries)
    @JoinColumn()
    registeredRLR: UserRLR;
}