import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DateTimeEntity } from './base/dateTime.entity';

@Entity('user_auth', { orderBy: { id: 'ASC' } })
export class AuthUser extends DateTimeEntity {
    constructor(id?: string, emailAddress?: string, password?: string, type?: string, createdAt?: Date, updatedAt?: Date) {
        super();
        this.id = id;
        this.emailAddress = emailAddress;
        this.password = password;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    };

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', unique: true, default: "" })
    emailAddress?: string;

    @Column({ type: 'varchar', nullable: true })
    password?: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    type?: string;
}