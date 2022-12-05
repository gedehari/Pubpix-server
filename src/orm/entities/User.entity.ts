import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { RefreshToken } from "./RefreshToken.entity"

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

    @CreateDateColumn({name: 'created_at', nullable: false})
    createdAt: Date

    @CreateDateColumn({name: "last_login_at", select: false, nullable: false})
    lastLoginAt: Date

    @OneToMany(() => RefreshToken, token => token.user)
    refreshTokens: RefreshToken[]
}
