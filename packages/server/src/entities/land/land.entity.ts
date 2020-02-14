import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Deed } from './deed.entity';

// @Entity('land', { orderBy: { id: 'ASC' } })
export class Land {
    @Column({ type: 'varchar', primary: true })
    id: string;
}