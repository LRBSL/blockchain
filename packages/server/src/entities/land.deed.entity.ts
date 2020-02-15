import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, Column, ManyToOne } from 'typeorm';
import { Land } from './land.entity';
import { UserNotary } from './user.notary.entity';
import { UserRLR } from './user.rlr.entity';

@Entity('land_deed')
export class LandDeed {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(type => Land)
    land?: Land;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    type?: string;

    @ManyToOne(type => UserNotary, registeredNotary => registeredNotary.user)
    registeredNotary?: UserNotary

    @ManyToOne(type => UserRLR, registeredRLR => registeredRLR.user)
    registeredRLR: UserRLR

    @CreateDateColumn()
    registeredAt?: Date;
}