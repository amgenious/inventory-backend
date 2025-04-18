import {Router} from "express"
const stockRouter = Router()

import * as Controller from '../controllers/stock.controller.js'

stockRouter.post('/add-stock',Controller.addStock)
stockRouter.get('/',Controller.getAllStock)
stockRouter.delete('/:id',Controller.deleteStock)
stockRouter.put("/update/:id", Controller.updateStock)


export default stockRouter;