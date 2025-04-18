import { DB } from "../connect.js";
export const addSupplier = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO supplier(name, email,contact,address) VALUES (? , ?, ?, ?)';
    let newId;
    try {
      DB.run(sql, [req.body.name, req.body.email,req.body.contact,req.body.address], function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer enemy_id
        res.status(201);
        let data = { status: 201, message: `New supplier saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    }
}
export const getAllSupplier = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM supplier';
    let data = { supplier: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.supplier.push({ id: row.id, name: row.name, email: row.email, contact:row.contact, address:row.address });
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
export const deleteSupplier = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }
    const sql = 'DELETE FROM supplier WHERE id=?';
    try {
      DB.run(sql, [id], function (err) {
        if (err) throw err;
        if (this.changes === 1) {
          //one item deleted
          res.status(200);
          res.send(`{"message":"Supplier ${req.query.id} was removed from list."}`);
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
export const updateSupplier = async(req,res)=> {
  res.set('content-type', 'application/json');
  const id = parseInt(req.params.id, 10);
  const { name,email,contact,address } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Supplier ID is required" });
  }

  if (!name || !email || !contact || !address) {
    return res.status(400).json({ message: "Missing supplier name or email or contact or address" });
  }

  const sql  = 'UPDATE supplier SET name = ?, email = ?, contact = ?, address = ? WHERE id = ?';
  DB.run(sql, [name, email, contact, address, id], function (err) {
    if (err) {
      console.error('Error updating supplier:', err);
      return res.status(500).json({ message: `Error updating supplier: ${err.message}` });
    }

    if (this.changes === 0) {
      return res.status(400).json({ message: "Supplier update not successful" });
    }

    res.status(200).json({ message: "Supplier updated successfully" });
  });
}