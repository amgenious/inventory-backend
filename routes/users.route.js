import {Router} from "express"
const userRouter = Router()

import * as Controller from '../controllers/user.controller.js'

userRouter.post('/add-user',Controller.addUser)
userRouter.get('/',Controller.getAllUsers)
userRouter.delete('/:id',Controller.deleteUser)
userRouter.put("/update/:id", Controller.updateUser)
userRouter.put("/updatepassword/:id",Controller.updateUserpassword  )

export default userRouter;