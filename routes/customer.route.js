import {Router} from "express"
const customerRouter = Router()
import * as Controller from '../controllers/customer.controller.js'

customerRouter.post('/add-customer',Controller.addCustomer)
customerRouter.get('/',Controller.getAllCustomer)
customerRouter.delete('/:id',Controller.deleteCustomer)
customerRouter.put('/update/:id', Controller.updateCustomer)

export default customerRouter;