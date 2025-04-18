import {Router} from "express"
const supplierRouter = Router()
import * as Controller from '../controllers/supplier.controller.js'

supplierRouter.post('/add-supplier',Controller.addSupplier)
supplierRouter.get('/',Controller.getAllSupplier)
supplierRouter.delete('/:id',Controller.deleteSupplier)
supplierRouter.put('/update/:id', Controller.updateSupplier)

export default supplierRouter;