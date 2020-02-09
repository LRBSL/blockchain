import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DateTimeEntity } from '../base/dateTime.entity';

@Entity('user_auth', { orderBy: { id: 'ASC' } })
export class User extends DateTimeEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar' })
    @Unique(['email'])
    email: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastLogin: string;

    @Column({ type: "boolean", default: false })
    isStaff: boolean;

    @Column({  type: "boolean", default: true })
    isActive: boolean;
}