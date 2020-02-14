import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('land_deed')
export class LandDeed {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    secureKey: number;
}