import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Land } from './land.entity';

// @Entity('land_map', { orderBy: { id: 'ASC' } })
export class LandMap {
    @OneToOne(() => Land, { primary: true, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id" })
    @PrimaryColumn({ type: 'varchar' })
    id: Land;

    @Column({ type: 'varchar' })
    userNic: string;

    @Column({ type: 'varchar' })
    secureKey: string;
}