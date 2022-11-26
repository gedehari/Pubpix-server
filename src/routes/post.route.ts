import { Router } from "express"

import { checkAuth } from "middlewares/auth.middleware"
import { upload, processUpload, list } from "controllers/post.controller"

const router = Router()

router.get("/", checkAuth, list)
router.post("/upload", checkAuth, processUpload, upload)

export default router
