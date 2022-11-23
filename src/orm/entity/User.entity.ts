import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({nullable: false})
    username: string

    @Column({name: "display_name", nullable: false})
    displayName: string

    @CreateDateColumn({name: 'created_at', nullable: false})
    createdAt: Date

    @Column({name: "last_login_at"})
    lastLoginAt: Date
}