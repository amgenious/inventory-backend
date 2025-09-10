import { DB } from "../connect.js";

export const addReceipt = async (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO receipt(referencenumber,valuedate,transtype,transcode,invoicenumber,invoicedate,supplier,remarks,itemname,partnumber,location,quantity) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    let newId;
    try {
      DB.run(sql, [req.body.referencenumber, req.body.valuedate,
      req.body.transtype,req.body.transcode,req.body.invoicenumber,req.body.invoicedate,req.body.supplier,req.body.remarks,
      req.body.itemname,req.body.partnumber,req.body.location,req.body.quantity], function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer enemy_id
        res.status(201);
        let data = { status: 201, message: `New issue saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    } 
}

export const getAllReceipt = async (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM receipt';
    let data = { receipt: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.receipt.push({ id: row.id, referencenumber: row.referencenumber, 
           valuedate : row.valuedate, transtype:row.transtype,transcode:row.transcode,invoicenumber:row.invoicenumber,invoicedate:row.invoicedate,
           supplier:row.supplier,remarks:row.remarks,itemname:row.itemname,partnumber:row.partnumber,
           quantity:row.quantity,location:row.location 
        });
        });
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(467);
      res.send(`{"code":467, "status":"${err.message}"}`);
    }
}

export const searchAllReceipt = async(req,res) => {
  const query = req.query.query;
  
  const sql = 'SELECT * FROM receipt WHERE referencenumber = ?';

  DB.all(sql, [query], (err, row) => {
    if (err) {
      console.error('Error searching receipt:', err.message);
      return res.status(500).json({ message: `Error searching receipt: ${err.message}` });
    }

    if (!row) {
      return res.status(404).json({ message: 'Such reference does not exist' });
    }

    return res.status(200).json({ searchedReceipt: row });
  });
}

export const updateReceipt = async(req,res) => {
  const id = parseInt(req.params.id, 10);
  // const {invoicenumber, transtype,transcode,supplier,remarks } = req.body;
  const { quantity } = req.body;
  // if (!id) {
  //   return res.status(400).json({ message: "Receipt ID is required" });
  // }

  // if (!transtype || !transcode) {
  //   return res.status(400).json({ message: "Missing receipt transtype or transcode" });
  // }

  const sql  = 'UPDATE receipt SET quantity = ? WHERE id = ?';
  DB.run(sql, [quantity, id], function (err) {
    if (err) {
      console.error('Error updating receipt:', err);
      return res.status(500).json({ message: `Error updating receipt: ${err.message}` });
    }

    if (this.changes === 0) {
      return res.status(400).json({ message: "Receipt update not successful" });
    }

    res.status(200).json({ message: "Receipt updated successfully" });
  });

}

export const searchReceipt = async(req,res) => {
  const { referencenumber,itemname, partnumber,invoicenumber, supplier, startDate, endDate } = req.query;
  const conditions = [];
  const params = [];  

  if (referencenumber) {
    conditions.push('referencenumber = ?');
    params.push(referencenumber);
  }
  if (itemname) {
    conditions.push('itemname = ?');
    params.push(itemname);
  }
  if (supplier) {
    conditions.push('supplier = ?');
    params.push(supplier);
  }
  if (invoicenumber) {
    conditions.push('invoicenumber = ?');
    params.push(customer);
  }
  if (partnumber) {
    conditions.push('partnumber = ?');
    params.push(partnumber);
  }
  if (startDate && endDate) {
  conditions.push('DATE(createdAt) BETWEEN DATE(?) AND DATE(?)');
  params.push(startDate, endDate);
}
  if (conditions.length === 0) {
    return res.status(400).json({ message: "At least one search parameter is required." });
  }
    const sql = `SELECT * FROM receipt WHERE ${conditions.join(' AND ')}`;  
          DB.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Search error:", err.message);
      return res.status(500).json({ message: `Error searching receipt: ${err.message}` });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({searchedReceipt:[], message: "Such reference does not exist" });
    }

    return res.status(200).json({ searchedReceipt: rows });
  });
}