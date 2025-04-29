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

stockRouter.post('/add-stockxlsx', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const normalizePartNumber = (pn) => {
    if (typeof pn === 'number') return pn.toString().split('.')[0];
    if (typeof pn === 'string') return pn.trim().replace(/\.0+$/, '');
    return '';
  };

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const insertSql = `
      INSERT INTO stock (
        name, description, category, location, measurement, partnumber,
        max_stock, min_stock, price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const checkSql = `SELECT COUNT(*) as count FROM stock WHERE partnumber = ?`;

    const insertStmt = DB.prepare(insertSql);
    const checkStmt = DB.prepare(checkSql);

    let remaining = rows.length;

    if (remaining === 0) {
      insertStmt.finalize();
      checkStmt.finalize();
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No data found in Excel file' });
    }

    for (const row of rows) {
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

      if (!name || !description || !category || !location || !partnumber) {
        remaining--;
        if (remaining === 0) finalizeAndRespond();
        continue;
      }

      const normalizedPartNumber = normalizePartNumber(partnumber);

      if (!normalizedPartNumber) {
        console.log("Skipping row with invalid partnumber:", partnumber);
        remaining--;
        if (remaining === 0) finalizeAndRespond();
        continue;
      }

      checkStmt.get([normalizedPartNumber], (err, existing) => {
        if (err) {
          console.error('Error checking existing stock:', err.message);
        }

        if (existing && existing.count > 0) {
          console.log(`Duplicate found, skipping partnumber: ${normalizedPartNumber}`);
        } else {
          insertStmt.run([
            name,
            description,
            category,
            location,
            measurement || '',
            normalizedPartNumber,
            parseInt(max_stock) || 0,
            parseInt(min_stock) || 0,
            parseFloat(price) || 0
          ]);
        }

        remaining--;
        if (remaining === 0) finalizeAndRespond();
      });
    }

    function finalizeAndRespond() {
      insertStmt.finalize();
      checkStmt.finalize();
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'Upload and import completed successfully' });
    }
  } catch (error) {
    console.error('Fatal error:', error);
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
});

export default stockRouter;