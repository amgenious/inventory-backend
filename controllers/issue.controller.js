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
           quantity:row.quantity 
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