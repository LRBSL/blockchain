import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DateTimeEntity } from '../base/dateTime.entity';

@Entity('user_auth', { orderBy: { id: 'ASC' } })
export class User extends DateTimeEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar' })
    @Unique(['email', 'regId'])
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'varchar' })
    type: string;

    @Column({ type: 'varchar' })
    regId: string;

    @Column({ type: 'varchar', default: 'first name' })
    firstName: string;

    @Column({ type: 'varchar', default: 'last name' })
    lastName: string;

    @Column({ type: 'varchar', default: 'nic' })
    nic: string;

    @Column({ type: 'varchar', default: 'contact' })
    contact: string;

    @Column({ type: 'varchar', default: 'postal address' })
    postalAddress: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastLogin: string;

    @Column({  type: "boolean", default: true })
    isActive: boolean;
}