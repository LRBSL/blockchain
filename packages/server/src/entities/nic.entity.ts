import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('nic')
export class NIC {
    @PrimaryColumn({ type: 'varchar', length: 20 })
    no: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', length: 1 })
    gender: string;

    @Column({ type: 'varchar' })
    postalAddress: string;

    @Column({ type: 'date' })
    registeredDate: Date;
}