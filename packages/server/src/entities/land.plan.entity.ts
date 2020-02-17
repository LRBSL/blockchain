import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm';

@Entity('land_plan')
export class LandPlan {
    constructor(id?: string, registeredSurveyor?: string, registeredRLR?: string, registeredAt?: Date) {
        this.id = id;
        this.registeredSurveyor = registeredSurveyor;
        this.registeredRLR = registeredRLR;
        this.registeredAt = registeredAt;
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: true })
    registeredSurveyor?: string;

    @Column({ type: 'varchar', nullable: true })
    registeredRLR?: string;

    @CreateDateColumn()
    registeredAt?: Date;
}