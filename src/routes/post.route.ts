import { Router } from "express"

import { checkAuth } from "middlewares/auth.middleware"
import { upload, processUpload } from "controllers/post.controller"

const router = Router()

router.post("/upload", checkAuth, processUpload, upload)

export default router
