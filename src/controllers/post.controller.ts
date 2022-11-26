import { Request, Response } from "express"
import fs from "fs"
import sharp from "sharp"
import { v4 as uuidv4 } from 'uuid';
import multer, { FileFilterCallback } from "multer"

import { getErrorDict } from "utils/error.util";
import { dataSource } from "orm/dataSource";
import { Post } from "orm/entities/Post.entity";
import { User } from "orm/entities/User.entity";

interface UploadRequest {
    caption: string
}

export const processUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        if (file.mimetype.split("/")[0] === 'image') {
            callback(null, true);
        } else {
            callback(new Error("Invalid input"));
        }
    }
}).single("image")

export async function upload(req: Request, res: Response) {
    const body = req.body as UploadRequest
    if (!body.caption) {
        return res.status(400).json(getErrorDict("MISSING_CAPTION"))
    }

    const user = res.locals.user as User
    console.log(user)

    const uuid = uuidv4()
    const fileName = uuid + process.env.UPLOAD_EXT
    const path = process.env.UPLOAD_PATH + fileName

    try {
        await sharp(req.file?.buffer).resize(null, 1080).jpeg({mozjpeg: true, quality: 70}).toFile(path)
    } catch (error) {
        const e = error as Error
        console.log(e.message)
        if (e.message === "Invalid input")
            return res.status(400).json(getErrorDict("INVALID_IMAGE"))
        return res.status(500).json(getErrorDict("UNKNOWN_ERROR"))
    }

    const repo = dataSource.getRepository(Post)
    const newPost = repo.create({userId: user.id, caption: body.caption, imageUuid: uuid})
    const result = await repo.save(newPost)

    return res.status(201).json(result)
}
