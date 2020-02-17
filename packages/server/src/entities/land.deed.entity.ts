import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm';

@Entity('land_deed')
export class LandDeed {
    constructor(id?: string, type?: string, registeredNotary?: string, registeredRLR?: string, registeredAt?: Date) {
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

    @Column({ type: 'varchar', nullable: true })
    registeredNotary?: string;

    @Column({ type: 'varchar', nullable: true })
    registeredRLR?: string

    @CreateDateColumn()
    registeredAt?: Date;
}