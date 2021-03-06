import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { AuthUser } from './user.auth.entity';
import { NIC } from './nic.entity';
import { LandDeed } from './land.deed.entity';
import { LandPlan } from './land.plan.entity';

@Entity('land')
export class Land {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @OneToOne(type => NIC)
    @JoinColumn()
    ownerNic?: NIC;

    @Column({ type: 'int' })
    secureKey?: number;

    @OneToOne(type => LandDeed)
    @JoinColumn()
    deed?: LandDeed;

    @OneToOne(type => LandPlan)
    @JoinColumn()
    plan?: LandPlan;
}