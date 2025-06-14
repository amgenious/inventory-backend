import {Router} from "express"
const issueRouter = Router()
import * as Controller from '../controllers/issue.controller.js'
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });

issueRouter.post('/add-issue', Controller.addIssues)
issueRouter.get('/',Controller.getAllIssues)
issueRouter.get('/search', Controller.searchAllIssue)
issueRouter.put('/update/:id', Controller.updateIssue)
issueRouter.get('/search/report',Controller.searchIssue)

issueRouter.post('/add-issuexlsx', upload.single('file'),async(req,res)=>{
    const filePath = req.file?.path
    if(!filePath){
        return res.status(400).json({message: 'No file uploaded'})
    }
    try{
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);  
         
        const sql = 'INSERT INTO issues(referencenumber,valuedate,transtype,transcode,customer,remarks,itemname,partnumber,location,quantity) VALUES (?,?,?,?,?,?,?,?,?,?)';
        const insertStmt = DB.prepare(sql);

         let remaining = rows.length;
            if (remaining === 0) {
              insertStmt.finalize();
              fs.unlinkSync(filePath);
              return res.status(400).json({ message: 'No data found in Excel file' });
            }
        for (const row of rows){
            let {
                referencenumber,
                valuedate,transtype,transcode,customer,
                remarks,itemname,partnumber,location,quantity
            } = row;
        if (!referencenumber || !itemname  || !location || !partnumber) {
        remaining--;
        if (remaining === 0) finalizeAndRespond();
        continue;
      }
        }
        function finalizeAndRespond() {
              insertStmt.finalize();
              fs.unlinkSync(filePath);
              res.status(200).json({ message: 'Upload and import completed successfully' });
    }
    }catch(error){
    console.error('Fatal error:', error);
    res.status(500).json({ message: 'Error processing file', error: error.message });
    }
})

export default issueRouter