import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Land } from './land.entity';
import { UserSurveyor } from './user.surveyor.entity';
import { LandDeed } from './land.deed.entity';
import { UserRLR } from './user.rlr.entity';

@Entity('land_plan')
export class LandPlan {
    constructor(id?: string, land?: Land, deed?: LandDeed, registeredSurveyor?: UserSurveyor, registeredRLR?: UserRLR, registeredAt?: Date) {
        this.id = id;
        this.land = land;
        this.deed = deed;
        this.registeredSurveyor = registeredSurveyor;
        this.registeredRLR = registeredRLR;
        this.registeredAt = registeredAt;
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(type => Land)
    land?: Land;

    @OneToOne(type => LandDeed)
    deed?: LandDeed;

    @ManyToOne(type => UserSurveyor, registeredSurveyor => registeredSurveyor.plans)
    @JoinColumn()
    registeredSurveyor?: UserSurveyor

    @ManyToOne(type => UserRLR, registeredRLR => registeredRLR.user)
    registeredRLR?: UserRLR

    @CreateDateColumn()
    registeredAt?: Date;
}