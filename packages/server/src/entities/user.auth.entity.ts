import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DateTimeEntity } from './base/dateTime.entity';

@Entity('user_auth', { orderBy: { id: 'ASC' } })
export class AuthUser extends DateTimeEntity { 
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', unique: true })
    emailAddress?: string;

    @Column({ type: 'varchar' })
    password?: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    type?: string;
}