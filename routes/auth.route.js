import {Router} from "express"
const authRouter = Router()

import * as Controller from '../controllers/auth.controller.js'

authRouter.post('/signin',Controller.signIn)

export default authRouter;