import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Land } from './land.entity';
import { UserSurveyor } from './user.surveyor.entity';
import { LandDeed } from './land.deed.entity';
import { UserRLR } from './user.rlr.entity';

@Entity('land_plan')
export class LandPlan {
    constructor(id?: string, registeredSurveyor?: UserSurveyor, registeredRLR?: UserRLR, registeredAt?: Date) {
        this.id = id;
        this.registeredSurveyor = registeredSurveyor;
        this.registeredRLR = registeredRLR;
        this.registeredAt = registeredAt;
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => UserSurveyor, registeredSurveyor => registeredSurveyor.plans)
    @JoinColumn()
    registeredSurveyor?: UserSurveyor

    @ManyToOne(type => UserRLR, registeredRLR => registeredRLR.user)
    registeredRLR?: UserRLR

    @CreateDateColumn()
    registeredAt?: Date;
}