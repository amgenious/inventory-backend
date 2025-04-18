import {Router} from "express"
const locationRouter = Router()
import * as Controller from '../controllers/location.controller.js'

locationRouter.post('/add-location',Controller.addLocation)
locationRouter.get('/',Controller.getAllLocation)
locationRouter.delete('/:id',Controller.deleteLocation)
locationRouter.put('/update/:id', Controller.updateLocation)

export default locationRouter;