import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { AuthUser } from './user.auth.entity';

@Entity('user_blockchain')
export class UserBlockchain {
    constructor(user?: AuthUser, identityName?: string, identityOrg?: string) {
        this.user = user;
        this.identityName = identityName;
        this.identityOrg = identityOrg;
    }

    @OneToOne(() => AuthUser, { primary: true, cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    user: AuthUser;

    @Column({ type: 'varchar', nullable: true })
    identityName?: string;

    @Column({ type: 'varchar', nullable: true })
    identityOrg?: string;
}