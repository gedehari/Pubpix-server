import { Router } from "express"

import { refresh, signIn, signUp } from "controllers/auth.controller"

const router = Router()

router.post("/signUp", signUp)
router.post("/signIn", signIn)
router.post("/refresh", refresh)

export default router
