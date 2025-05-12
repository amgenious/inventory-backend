import {Router} from "express"
const issueRouter = Router()
import * as Controller from '../controllers/issue.controller.js'

issueRouter.post('/add-issue', Controller.addIssues)
issueRouter.get('/',Controller.getAllIssues)


export default issueRouter