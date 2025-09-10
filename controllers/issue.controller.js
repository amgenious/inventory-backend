import { DB } from "../connect.js";

export const addIssues = async (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO issues(referencenumber,valuedate,transtype,transcode,customer,remarks,itemname,partnumber,location,quantity) VALUES (?,?,?,?,?,?,?,?,?,?)';
    let newId;
    try {
      DB.run(sql, [req.body.referencenumber, req.body.valuedate,
      req.body.transtype,req.body.transcode,req.body.customer,req.body.remarks,
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

export const getAllIssues = async (req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM issues';
    let data = { issues: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.issues.push({ id: row.id, referencenumber: row.referencenumber, 
           valuedate : row.valuedate, transtype:row.transtype,transcode:row.transcode,
           customer:row.customer,remarks:row.remarks,itemname:row.itemname,partnumber:row.partnumber,
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

export const searchAllIssue = async(req,res) => {
  const query = req.query.query;
  
  const sql = 'SELECT * FROM issues WHERE referencenumber = ?';

  DB.all(sql, [query], (err, row) => {
    if (err) {
      console.error('Error searching issue:', err.message);
      return res.status(500).json({ message: `Error searching issue: ${err.message}` });
    }

    if (!row) {
      return res.status(404).json({ message: 'Such reference does not exist' });
    }

    return res.status(200).json({ searchedIssue: row });
  });
}

export const updateIssue = async(req,res) => {
  const id = parseInt(req.params.id, 10);
  // const { transtype,transcode,customer,remarks } = req.body;
  const { quantity } = req.body;
  // if (!id) {
  //   return res.status(400).json({ message: "Issue ID is required" });
  // }

  // if (!transtype || !transcode) {
  //   return res.status(400).json({ message: "Missing issue transtype or transcode" });
  // }

  const sql  = 'UPDATE issues SET quantity = ? WHERE id = ?';
  DB.run(sql, [quantity, id], function (err) {
    if (err) {
      console.error('Error updating issue:', err);
      return res.status(500).json({ message: `Error updating issue: ${err.message}` });
    }

    if (this.changes === 0) {
      return res.status(400).json({ message: "Issue update not successful" });
    }

    res.status(200).json({ message: "Issue updated successfully" });
  });

}

export const searchIssue = async(req,res) => {
  const { referencenumber,itemname, partnumber, customer, startDate, endDate } = req.query;
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
  if (customer) {
    conditions.push('customer = ?');
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
    const sql = `SELECT * FROM issues WHERE ${conditions.join(' AND ')}`;  
          DB.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Search error:", err.message);
      return res.status(500).json({ message: `Error searching stock: ${err.message}` });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({searchedIssue:[], message: "Such reference does not exist" });
    }

    return res.status(200).json({ searchedIssue: rows });
  });
}