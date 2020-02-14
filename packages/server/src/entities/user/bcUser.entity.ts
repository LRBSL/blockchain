import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

// @Entity('user_bc_auth', { orderBy: { id: 'ASC' } })
export class BcUser {
    @OneToOne(() => User, { primary: true, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id" })
    id: User;

    @Column({ type: 'varchar', default: '' })
    identityName: string;

    @Column({ type: 'varchar', default: '' })
    identityOrg: string;
}