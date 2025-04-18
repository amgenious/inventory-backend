import { DB } from "../connect.js";
export const addCategory = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO category(name, description) VALUES (? , ?)';
    let newId;
    try {
      DB.run(sql, [req.body.name, req.body.description], function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer enemy_id
        res.status(201);
        let data = { status: 201, message: `New category saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    }
}
export const getAllCategory = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM category';
    let data = { categories: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.categories.push({ id: row.id, name: row.name, description: row.description });
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
export const deleteCategory = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const sql = 'DELETE FROM category WHERE id=?';
    try {
      DB.run(sql, [id], function (err) {
        if (err) throw err;
        if (this.changes === 1) {
          //one item deleted
          res.status(200);
          res.send(`{"message":"Category ${req.query.id} was removed from list."}`);
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
export const updateCategory = async(req,res)=> {
  res.set('content-type', 'application/json');
  const id = parseInt(req.params.id, 10);
  const { name,description } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  if (!name || !description) {
    return res.status(400).json({ message: "Missing category name or description" });
  }

  const sql  = 'UPDATE category SET name = ?, description = ? WHERE id = ?';
  DB.run(sql, [name, description, id], function (err) {
    if (err) {
      console.error('Error updating category:', err);
      return res.status(500).json({ message: `Error updating category: ${err.message}` });
    }

    if (this.changes === 0) {
      return res.status(400).json({ message: "Category update not successful" });
    }

    res.status(200).json({ message: "Category updated successfully" });
  });
}