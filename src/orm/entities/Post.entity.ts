import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User.entity"

@Entity()
export class Post {
    @PrimaryGeneratedColumn("increment")
    id: number

    @ManyToOne(type => User)
    author: User

    @Column({nullable: false, length: 1024})
    caption: string

    @Column({name: "image_uuid", nullable: false, length: 64})
    imageUuid: string

    @CreateDateColumn({name: 'created_at', nullable: false})
    createdAt: Date
}
