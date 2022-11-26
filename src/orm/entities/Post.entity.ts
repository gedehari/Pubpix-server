import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Post {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({name: "user_id", type: "int", nullable: false})
    userId: number

    @Column({nullable: false, length: 1024})
    caption: string

    @Column({name: "image_uuid", nullable: false, length: 64})
    imageUuid: string

    @CreateDateColumn({name: 'created_at', nullable: false})
    createdAt: Date
}
