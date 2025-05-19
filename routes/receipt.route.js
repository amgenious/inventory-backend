import {Router} from "express"
const receiptRouter = Router()
import * as Controller from '../controllers/receipt.controller.js'

receiptRouter.post('/add-receipt', Controller.addReceipt)
receiptRouter.get('/', Controller.getAllReceipt)

export default receiptRouter