import { Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"

import { dataSource } from "orm/dataSource"
import { User } from "orm/entities/User.entity"
import { getErrorDict } from "utils/error.util"
import { generateToken } from "../middlewares/auth.middleware"

interface SignUpRequest {
    username: string
    displayName: string,
    password: string
}

interface SignInRequest {
    username: string,
    password: string
}

interface RefreshRequest {
    refreshToken: string
}

// TODO: maybe automatically sign in when signing up
export async function signUp(req: Request, res: Response) {
    const body: SignUpRequest = req.body as SignUpRequest
    if (!(body.username && body.displayName && body.password)) {
        return res.status(400).json(getErrorDict("MISSING_CREDENTIALS"))
    }

    const repo = dataSource.getRepository(User)

    // Ignore if username already exists
    const sameUserCount = await repo.count({where: {username: body.username}})
    if (sameUserCount > 0) {
        res.status(400).json(getErrorDict("USERNAME_EXISTS"))
        return   
    }

    const usernameRegex = /^[a-zA-Z\-]+$/
    if (body.username.search(usernameRegex) < 0 && body.username.length > 32) {
        res.status(400).json(getErrorDict("INVALID_USERNAME"))
        return
    }

    if (body.password.length < 8) {
        res.status(400).json(getErrorDict("INVALID_PASSWORD"))
        return
    }

    const newUser = repo.create()
    newUser.username = body.username
    newUser.displayName = body.displayName
    newUser.hashedPassword = await bcrypt.hash(body.password, 16)

    try {
        const result = await repo.save(newUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json(getErrorDict("UNKNOWN_ERROR"))
    }

    return res.status(201).json({msg: "User created."})
}

export async function signIn(req: Request, res: Response) {
    const body: SignInRequest = req.body as SignInRequest
    if (!(body.username && body.password)) {
        return res.status(400).json(getErrorDict("MISSING_CREDENTIALS"))
    }

    const repo = dataSource.getRepository(User)
    const user = await repo.createQueryBuilder()
        .select()
        // TypeOrm wont fill hashedPassword if I didn't do it this way
        .addSelect("hashed_password", "User_hashed_password")
        .where("username = :u", {u: body.username})
        .getOne()
    if (!user) {
        return res.status(400).json(getErrorDict("USERNAME_NOT_FOUND"))
    }

    try {
        const passwordCorrect = await bcrypt.compare(body.password, user.hashedPassword)
        if (!passwordCorrect) {
            return res.status(400).json(getErrorDict("INVALID_CREDENTIALS"))
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(getErrorDict("UNKNOWN_ERROR"))
    }

    return res.json(generateToken(user))
}

export async function refresh(req: Request, res: Response) {
    const body: RefreshRequest = req.body as RefreshRequest
    if (!body.refreshToken) {
        return res.status(400).json(getErrorDict("MISSING_REFRESH_TOKEN"))
    }

    try {
        const decoded = jwt.verify(body.refreshToken, process.env.REFRESH_KEY as string) as JwtPayload
        const repo = dataSource.getRepository(User)
        const user = await repo.findOne({where: {username: decoded.username}})
        if (!user) {
            return res.status(400).json(getErrorDict("INVALID_REFRESH_TOKEN"))
        }
        return res.json(generateToken(user))
    } catch (error) {
        return res.status(400).json(getErrorDict("INVALID_REFRESH_TOKEN"))
    }
}
