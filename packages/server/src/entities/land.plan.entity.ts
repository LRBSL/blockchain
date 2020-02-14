import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('land_plan')
export class LandPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    secureKey: number;
}