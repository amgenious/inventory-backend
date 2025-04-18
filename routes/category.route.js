import {Router} from "express"
const categoryRouter = Router()
import * as Controller from '../controllers/category.controller.js'

categoryRouter.post('/add-category',Controller.addCategory)
categoryRouter.get('/',Controller.getAllCategory)
categoryRouter.delete('/:id',Controller.deleteCategory)
categoryRouter.put('/update/:id', Controller.updateCategory)

export default categoryRouter;