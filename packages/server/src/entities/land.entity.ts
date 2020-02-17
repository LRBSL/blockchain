import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { NIC } from './nic.entity';
import { LandDeed } from './land.deed.entity';
import { LandPlan } from './land.plan.entity';

@Entity('land')
export class Land {
    constructor(id?: string, ownerNic?: string, secureKey?: number, deed?: string, plan?: string) {
        this.id = id;
        this.ownerNic = ownerNic;
        this.secureKey = secureKey;
        this.deed = deed;
        this.plan = plan;
    }

    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'int' })
    secureKey?: number;

    @Column({ type: 'varchar' })
    ownerNic?: string;

    @Column({ type: 'varchar' })
    deed?: string;

    @Column({ type: 'varchar' })
    plan?: string;
}