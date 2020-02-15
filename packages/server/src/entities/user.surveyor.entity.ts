import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { LandPlan } from './land.plan.entity';

@Entity('user_surveyor')
export class UserSurveyor extends User {
    @Column({ type: 'varchar', nullable: true })
    firstName?: string;

    @Column({ type: 'varchar', nullable: true })
    lastName?: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    nic?: string;

    @OneToMany(type => LandPlan, plans => plans.registeredSurveyor)
    plans?: LandPlan[];
}