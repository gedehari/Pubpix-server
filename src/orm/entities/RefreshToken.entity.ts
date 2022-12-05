import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User.entity";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({name: "refresh_token", nullable: false, length: 1024})
    refreshToken: string

    @ManyToOne(() => User)
    user: User
}