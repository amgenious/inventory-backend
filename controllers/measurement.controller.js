import { DB } from "../connect.js";
export const addMeasurement = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO measurement(name) VALUES (?)';
    let newId;
    try {
      DB.run(sql, [req.body.name], function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer enemy_id
        res.status(201);
        let data = { status: 201, message: `New Measurement saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    }
}
export const getAllMeasurement = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM measurement';
    let data = { measurement: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.measurement.push({ id: row.id, name: row.name });
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
export const deleteMeasurement = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Measurement ID" });
    }
    const sql = 'DELETE FROM measurement WHERE id=?';
    try {
      DB.run(sql, [id], function (err) {
        if (err) throw err;
        if (this.changes === 1) {
          //one item deleted
          res.status(200);
          res.send(`{"message":"Measurement ${req.query.id} was removed from list."}`);
        } else {
          //no delete done
          res.status(200);
          res.send(`{"message":"No operation needed."}`);
        }
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    }
}

export const updateMeasurement = async(req,res)=> {
  res.set('content-type', 'application/json');
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Measurement ID is required" });
  }

  if (!name) {
    return res.status(400).json({ message: "Missing measurement name" });
  }

  const sql = 'UPDATE measurement SET name = ? WHERE id = ?';
  DB.run(sql, [name, id], function (err) {
    if (err) {
      console.error('Error updating measurement:', err);
      return res.status(500).json({ message: `Error updating measurement: ${err.message}` });
    }

    if (this.changes === 0) {
      return res.status(400).json({ message: "Measurement update not successful" });
    }

    res.status(200).json({ message: "Measurement updated successfully" });
  });
}