import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({nullable: false, unique: true, length: 32})
    username: string

    @Column({name: "display_name", nullable: false, length: 64})
    displayName: string

    @Column({name: "hashed_password", select: false, nullable: false, length: 128})
    hashedPassword: string

    @CreateDateColumn({name: 'created_at', select: false, nullable: false})
    createdAt: Date

    // TODO: use CreateDataColumn for this one
    @Column({name: "last_login_at", select: false, nullable: true})
    lastLoginAt?: Date = undefined
}
