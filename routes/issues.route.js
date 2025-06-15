import {Router} from "express"
const issueRouter = Router()
import * as Controller from '../controllers/issue.controller.js'
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import { DB } from "../connect.js";

const upload = multer({ dest: 'uploads/' });

issueRouter.post('/add-issue', Controller.addIssues)
issueRouter.get('/',Controller.getAllIssues)
issueRouter.get('/search', Controller.searchAllIssue)
issueRouter.put('/update/:id', Controller.updateIssue)
issueRouter.get('/search/report',Controller.searchIssue)

issueRouter.post('/add-issuexlsx', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ message: 'No file uploaded' });

  const normalizePartNumber = (pn) => {
    if (typeof pn === 'number') return pn.toString().split('.')[0];
    if (typeof pn === 'string') return pn.trim().replace(/\.0+$/, '');
    return '';
  };

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    const insertIssueSql = `
      INSERT INTO issues(referencenumber, valuedate, transtype, transcode, customer, remarks, itemname, partnumber, location, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertIssueStmt = DB.prepare(insertIssueSql);

    if (rows.length === 0) {
      insertIssueStmt.finalize();
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No data found in Excel file' });
    }

    const handleRow = (row) => {
      return new Promise((resolve, reject) => {
        let {
          referencenumber,
          valuedate, transtype, transcode, customer,
          remarks, itemname, partnumber, location, quantity
        } = row;

        if (!referencenumber || !itemname || !location || !partnumber) return resolve();

        const normalizedRef = normalizePartNumber(referencenumber);
        const qty = parseFloat(quantity) || 0;

        insertIssueStmt.run([
          normalizedRef, valuedate || '', transtype || '', transcode || '',
          customer || '', remarks || '', itemname, partnumber, location, qty
        ], (err) => {
          if (err) return reject(err);

          // 1. Get current quantity from openbalance
          DB.get(`SELECT quantity FROM openbalance WHERE name LIKE ?`, [itemname], (err, row) => {
            if (err) return reject(err);

            const prevQuantity = row?.quantity ?? 0;
            const newQuantity = prevQuantity - qty;

            // 2. Insert into stockhistory
            DB.run(`
              INSERT INTO stockhistory (name, prevQuantity, addedQuantity, newQuantity)
              VALUES (?, ?, ?, ?)
            `, [itemname, prevQuantity, qty, newQuantity], (err) => {
              if (err) return reject(err);

              // 3. Update openbalance
              DB.run(`UPDATE openbalance SET quantity = ? WHERE name = ?`, [newQuantity, itemname], (err) => {
                if (err) return reject(err);

                // 4. Update stock
                DB.run(`UPDATE stock SET quantity = ? WHERE name = ?`, [newQuantity, itemname], (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              });
            });
          });
        });
      });
    };

    // Process all rows in parallel and wait for completion
    await Promise.all(rows.map(handleRow));

    insertIssueStmt.finalize();
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'Upload and update completed successfully' });

  } catch (error) {
    console.error('Fatal error:', error);
    res.status(500).json({ message: 'Error processing file', error: error.message });
  } finally {
    console.log("Ended");
  }
});


export default issueRouter