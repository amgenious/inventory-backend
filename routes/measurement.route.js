import {Router} from "express"
const measurementRouter = Router()
import * as Controller from '../controllers/measurement.controller.js'

measurementRouter.post('/add-measurement',Controller.addMeasurement)
measurementRouter.get('/',Controller.getAllMeasurement)
measurementRouter.delete('/:id',Controller.deleteMeasurement)
measurementRouter.put('/update/:id', Controller.updateMeasurement)

export default measurementRouter;