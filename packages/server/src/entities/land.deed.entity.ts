import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from 'typeorm';
import { UserNotary } from './user.notary.entity';
import { UserRLR } from './user.rlr.entity';

@Entity('land_deed')
export class LandDeed {
    constructor(id?: string, type?: string, registeredNotary?: UserNotary, registeredRLR?: UserRLR, registeredAt?: Date) {
        this.id = id;
        this.type = type;
        this.registeredNotary = registeredNotary;
        this.registeredRLR = registeredRLR;
        this.registeredAt = registeredAt;
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    type?: string;

    @ManyToOne(type => UserNotary, registeredNotary => registeredNotary.user)
    registeredNotary?: UserNotary

    @ManyToOne(type => UserRLR, registeredRLR => registeredRLR.user)
    registeredRLR?: UserRLR

    @CreateDateColumn()
    registeredAt?: Date;
}