import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { NIC } from './nic.entity';
import { LandDeed } from './land.deed.entity';
import { LandPlan } from './land.plan.entity';

@Entity('land')
export class Land {
    constructor(id?: string, ownerNic?: NIC, secureKey?: number, deed?: LandDeed, plan?: LandPlan) {
        this.id = id;
        this.ownerNic = ownerNic;
        this.secureKey = secureKey;
        this.deed = deed;
        this.plan = plan;
    }

    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @ManyToOne(type => NIC, ownerNic => ownerNic.no)
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