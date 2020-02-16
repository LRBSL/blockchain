import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('nic')
export class NIC {
    constructor(no?: string, name?: string, gender?: string, postalAddress?: string, registeredDate?: Date) {
        this.no = no;
        this.name = name;
        this.gender = gender;
        this.postalAddress = postalAddress;
        this.registeredDate = registeredDate;
    }

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