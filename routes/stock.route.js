import {Router} from "express"
const stockRouter = Router()
import multer from 'multer';
import xlsx from 'xlsx';
import { DB } from "../connect.js";
import fs from 'fs';
import * as Controller from '../controllers/stock.controller.js'

const upload = multer({ dest: 'uploads/' });

stockRouter.post('/add-stock',Controller.addStock)
stockRouter.get('/',Controller.getAllStock)
stockRouter.delete('/:id',Controller.deleteStock)
stockRouter.put("/update/:id", Controller.updateStock)

stockRouter.post('/add-stockxlsx', upload.single('file'), async(req,res)=>{
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const normalizePartNumber = (pn) => {
        if (typeof pn === 'number') {
          return pn.toString().split('.')[0]; // Remove `.0`
        }
        if (typeof pn === 'string') {
          return pn.trim().replace(/\.0+$/, ''); // Remove .0 from end of string
        }
        return ''; // fallback
      };
    try {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
  
      const insertSql = `
        INSERT INTO stock (
          name, description, category, location, measurement, partnumber,
          max_stock, min_stock, price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      const checkSql = `SELECT COUNT(*) as count FROM stock WHERE partnumber = ?`;
  
      const insertStmt = DB.prepare(insertSql);
      const checkStmt = DB.prepare(checkSql);
      console.log("checkstmt",checkStmt)
  
      for (const row of data) {
        let {
          name,
          description,
          category,
          location,
          measurement,
          partnumber,
          max_stock,
          min_stock,
          price
        } = row;
  
        // Required fields
        if (!name || !description || !category || !location || !partnumber) continue;

        const normalizedPartNumber = normalizePartNumber(partnumber);
  
       
    if (!normalizedPartNumber) {
        console.log("Skipping row with invalid partnumber:", partnumber);
        continue;
      }
  
      const existing = checkStmt.get([normalizedPartNumber]);
  
      console.log(`Checking partnumber: ${normalizedPartNumber}`, existing);
  
      if (existing && existing.count > 0) {
        console.log(`Duplicate found, skipping partnumber: ${normalizedPartNumber}`);
        continue;
      }
        insertStmt.run([
          name,
          description,
          category,
          location,
          measurement || '',
          normalizedPartNumber,
          max_stock || 0,
          min_stock || 0,
          price || 0
        ]);
      }
  
      insertStmt.finalize();
      checkStmt.finalize();
      fs.unlinkSync(filePath); // Clean up uploaded file
  
      res.status(200).json({ message: 'Upload and import successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing file', error: error.message });
    }
})


export default stockRouter;