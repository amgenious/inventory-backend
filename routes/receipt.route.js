import {Router} from "express"
const receiptRouter = Router()
import * as Controller from '../controllers/receipt.controller.js'

receiptRouter.post('/add-receipt', Controller.addReceipt)
receiptRouter.get('/', Controller.getAllReceipt)
receiptRouter.get('/search', Controller.searchAllReceipt)
receiptRouter.put('/update/:id', Controller.updateReceipt)
receiptRouter.get('/search/report', Controller.searchReceipt)

export default receiptRouter