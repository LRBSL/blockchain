import { Column, Index, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { AuthUser } from './user.auth.entity';

export class User {
    @OneToOne(type => AuthUser, { primary: true, cascade: true })
    @JoinColumn()
    user: AuthUser;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    @Index({ unique: true, where: "registeredId IS NOT NULL" })
    registeredId?: string;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    publicName?: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    contactNo?: string;

    @Column({ type: 'varchar', nullable: true })
    postalAddress?: string;

    @CreateDateColumn()
    registeredAt?: Date;
}