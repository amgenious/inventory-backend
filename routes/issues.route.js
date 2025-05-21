import {Router} from "express"
const issueRouter = Router()
import * as Controller from '../controllers/issue.controller.js'

issueRouter.post('/add-issue', Controller.addIssues)
issueRouter.get('/',Controller.getAllIssues)
issueRouter.get('/search', Controller.searchAllIssue)
issueRouter.put('/update/:id', Controller.updateIssue)
issueRouter.get('/search/report',Controller.searchIssue)


export default issueRouter