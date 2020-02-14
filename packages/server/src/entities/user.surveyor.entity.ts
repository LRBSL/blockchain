import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

@Entity('user_surveyor')
export class UserSurveyor extends User {
    @Column({ type: 'varchar', nullable: true })
    firstName?: string;

    @Column({ type: 'varchar', nullable: true })
    lastName?: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    nic?: string;
}