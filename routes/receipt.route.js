import {Router} from "express"
const receiptRouter = Router()
import * as Controller from '../controllers/receipt.controller.js'
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });

receiptRouter.post('/add-receipt', Controller.addReceipt)
receiptRouter.get('/', Controller.getAllReceipt)
receiptRouter.get('/search', Controller.searchAllReceipt)
receiptRouter.put('/update/:id', Controller.updateReceipt)
receiptRouter.get('/search/report', Controller.searchReceipt)

receiptRouter.post('/add-receiptxlsx', upload.single('file'),async(req,res)=>{
    const filePath = req.file?.path
    if(!filePath){
        return res.status(400).json({message: 'No file uploaded'})
    }
    try{
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);  
         
        const sql = 'INSERT INTO receipt(referencenumber,valuedate,transtype,transcode,invoicenumber,invoicedate,supplier,remarks,itemname,partnumber,location,quantity) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
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
                valuedate,transtype,transcode,invoicenumber,invoicedate,supplier,
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

export default receiptRouter