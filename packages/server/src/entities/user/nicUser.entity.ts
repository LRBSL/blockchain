import { Column, Entity } from 'typeorm';

// @Entity('nic_user', { orderBy: { nic_no: 'ASC' } })
export class NicUser {
    @Column({ type: 'varchar', primary: true })
    nic_no: string;

    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', nullable: true })
    address?: string;

    @Column({ type: 'varchar', nullable: true })
    sex?: string;

    @Column({ type: 'datetime', nullable: true })
    regDate?: Date;
}