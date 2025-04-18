import { DB } from "../connect.js";
export const addLocation = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO location(name) VALUES (?)';
    let newId;
    try {
      DB.run(sql, [req.body.name], function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer enemy_id
        res.status(201);
        let data = { status: 201, message: `New location saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    }
}
export const getAllLocation = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM location';
    let data = { location: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.location.push({ id: row.id, name: row.name });
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
export const deleteLocation = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid location ID" });
    }
    const sql = 'DELETE FROM location WHERE id=?';
    try {
      DB.run(sql, [id], function (err) {
        if (err) throw err;
        if (this.changes === 1) {
          //one item deleted
          res.status(200);
          res.send(`{"message":"Location ${req.query.id} was removed from list."}`);
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

export const updateLocation = async(req,res)=> {
  res.set('content-type', 'application/json');
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Location ID is required" });
  }

  if (!name) {
    return res.status(400).json({ message: "Missing location name" });
  }

  const sql = 'UPDATE location SET name = ? WHERE id = ?';
  DB.run(sql, [name, id], function (err) {
    if (err) {
      console.error('Error updating location:', err);
      return res.status(500).json({ message: `Error updating location: ${err.message}` });
    }

    if (this.changes === 0) {
      return res.status(400).json({ message: "Location update not successful" });
    }

    res.status(200).json({ message: "Location updated successfully" });
  });
}