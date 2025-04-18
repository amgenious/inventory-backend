import { DB } from "../connect.js";


export const addStock = async(req,res) => {
    const {
        name,
        description,
        category,
        location,
        measurement,
        partnumber,
        max_stock,
        min_stock,
        price
      } = req.body;

      if (!name || !category || !location || !partnumber) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const sql = `
      INSERT INTO stock (
        name,description, category, location, measurement, partnumber,
        max_stock, min_stock, price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        name,
        description,
        category,
        location,
        measurement || '',
        partnumber,
        max_stock || 0,
        min_stock || 0,
        price || 0
      ];
      DB.run(sql, params, function (err) {
        if (err) {
          console.error('Error inserting stock:', err);
          return res.status(500).json({ message: `Error creating stock: ${err.message}` });
        }
    
        res.status(201).json({
          message: "Stock created successfully",
          stockId: this.lastID
        });
      });
}
export const getAllStock = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM stock';
    let data = { stock: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.stock.push({ id: row.id, 
            name: row.name,
            description:row.description, 
            category: row.category,
            location:row.location,
            measurement:row.measurement,
            partnumber:row.partnumber,
            max_stock:row.max_stock,
            min_stock:row.min_stock, 
            price: row.price });
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
export const deleteStock = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid stock ID" });
    }
    const sql = 'DELETE FROM stock WHERE id=?';
    try {
      DB.run(sql, [id], function (err) {
        if (err) throw err;
        if (this.changes === 1) {
          //one item deleted
          res.status(200);
          res.send(`{"message":"Stock ${req.query.id} was removed from list."}`);
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
export const updateStock = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    const {  name,
        description,
        category,
        location,
        measurement,
        partnumber,
        max_stock,
        min_stock,
        price } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid stock ID" });
    }
    if (!name || !description || !category) {
      return res.status(400).json({ message: "Missing stock name or description or category" });
    }
    const sql  = `UPDATE stock SET name = ?, description = ?, category = ?, location = ?, measurement = ?, partnumber = ?, max_stock = ?, min_stock = ?, price = ? WHERE id = ?`;
    DB.run(sql, [name,description,category,location,measurement,partnumber,max_stock,min_stock,price, id], function (err) {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: `Error updating stock: ${err.message}` });
      }
  
      if (this.changes === 0) {
        return res.status(400).json({ message: "Stock update not successful" });
      }
  
      res.status(200).json({ message: "Stock updated successfully" });
    });
}
