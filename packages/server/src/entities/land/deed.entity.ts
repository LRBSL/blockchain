import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../user/user.entity';
import { Land } from './land.entity';

@Entity('deed', { orderBy: { id: 'ASC' } })
export class Deed {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Land)
    @JoinColumn()
    land: Land;

    @OneToOne(() => User)
    @JoinColumn()
    registeredNotary: User;

    @Column({ type: 'varchar', nullable: true })
    type?: string;

    @Column({ type: 'datetime', nullable: true })
    registeredDate?: Date;
}