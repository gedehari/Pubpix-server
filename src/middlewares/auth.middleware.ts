import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { User } from "orm/entities/User.entity"
import { getErrorDict } from "utils/error.util"
import { dataSource } from "orm/dataSource"
import { RefreshToken } from "orm/entities/RefreshToken.entity"

interface TokenResponse {
    accessToken: string,
    refreshToken: string,
    expiresIn: Date
}

export async function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.get('Authorization')
        if (!authHeader) {
            throw new Error()
        }

        // Note: token format is: Bearer <token>
        const split = authHeader.split(" ")
        if (split[0] !== "Bearer") {
            throw new Error()
        }

        const token = split[1]
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_KEY as string) as JwtPayload
            const repo = dataSource.getRepository(User)
            const user = await repo.findOne({where: {username: decoded.username}})
            if (!user) {
                throw new Error()
            }

            res.locals.user = user
            next()
        } catch (error) {
            throw new Error()
        }
    } catch (error) {
        return res.status(401).json(getErrorDict("ACCESS_DENIED"))
    }
}

export async function generateToken(user: User): Promise<TokenResponse> {
    const now = new Date()
    user.lastLoginAt = new Date(now.getTime())

    const userRepo = dataSource.getRepository(User)
    await userRepo.save(user)

    const accessExpiry = 60 * 30

    const accessToken = jwt.sign({username: user.username}, process.env.ACCESS_KEY as string, {expiresIn: accessExpiry})
    const refreshToken = jwt.sign({username: user.username}, process.env.REFRESH_KEY as string, {expiresIn: "7d"})

    const refreshTokenRepo = dataSource.getRepository(RefreshToken)
    const refreshTokenEntity = refreshTokenRepo.create({refreshToken: refreshToken, user: user})
    await refreshTokenRepo.save(refreshTokenEntity)

    return {
        accessToken,
        refreshToken,
        expiresIn: new Date(now.getTime() + accessExpiry * 1000)
    }
}
