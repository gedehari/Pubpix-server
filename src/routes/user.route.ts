import { Router } from "express"

import { refresh, signIn, signUp } from "controllers/user.controller"

const router = Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/refresh", refresh)

export default router
