import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({nullable: false, unique: true, length: 32})
    username: string

    @Column({name: "display_name", nullable: false, length: 64})
    displayName: string

    @Column({name: "hashed_password", nullable: false, length: 128})
    hashedPassword: string

    @CreateDateColumn({name: 'created_at', nullable: false})
    createdAt: Date

    @Column({name: "last_login_at", nullable: true})
    lastLoginAt?: Date = undefined
}
