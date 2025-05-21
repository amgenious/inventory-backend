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
export const addOpenBalance = async(req,res) => {
   res.set('content-type', 'application/json');
  const {name,location,partnumber,quantity} = req.body;
   if (!name || !location || !partnumber || !quantity) {
        return res.status(400).json({ message: "Missing required fields" });
      }
    const sql = 'INSERT INTO openbalance (name,location,partnumber,quantity) VALUES (?, ?, ?, ?)';
    let newId;
    const params = [name,location,partnumber,quantity];
    try {
      DB.run(sql, params, function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer enemy_id
        res.status(201);
        let data = { status: 201, message: `New open balance stock saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    }  
}
export const getAllOpenBalances = async(req,res)=>{
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM openbalance';
    let data = { openbalance: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.openbalance.push({ id: row.id, 
            name: row.name, location:row.location,partnumber:row.partnumber,
          max_stock:row.max_stock,min_stock:row.min_stock,quantity:row.quantity });
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
export const updateStockQuantity = async (req,res)=>{
  res.set('content-type', 'application/json');
  const id = req.params.id
  const {newquantity} = req.body
  // if (!id) {
  //   return res.status(400).json({ message: "Stock uniquename is required" });
  // }
  // if (!newquantity) {
  //   return res.status(400).json({ message: "Missing new stock quantity" });
  // }
   const sql  = 'UPDATE openbalance SET quantity = ? WHERE name = ?';
    DB.run(sql, [newquantity, id], function (err) {
    if (err) {
      console.error('Error updating stock:', err);
      return res.status(500).json({ message: `Error updating stock: ${err.message}` });
    }

    if (this.changes === 0) {
      return res.status(400).json({ message: "Stock quantity update not successful" });
    }

    res.status(200).json({ message: "Stock quantity updated successfully" });
  });
}
export const addStockHistory = async(req,res) => {
   res.set('content-type', 'application/json');
    const {name,prevQuantity,addedQuantity,newQuantity} = req.body;
    const sql = 'INSERT INTO stockhistory (name,prevQuantity,addedQuantity,newQuantity) VALUES (?, ?, ?, ?)';
    let newId;
    const params = [name,prevQuantity,addedQuantity,newQuantity];
    try {
      DB.run(sql, params, function (err) {
        if (err) throw err;
        newId = this.lastID; //provides the auto increment integer enemy_id
        res.status(201);
        let data = { status: 201, message: `New stock history saved.` };
        let content = JSON.stringify(data);
        res.send(content);
      });
    } catch (err) {
      console.log(err.message);
      res.status(468);
      res.send(`{"code":468, "status":"${err.message}"}`);
    }  
}

export const searchOpenabalance = async(req,res) => {
  const { name, quantity, partnumber, location,startDate, endDate } = req.query;
  const conditions = [];
  const params = [];

  if (name) {
    conditions.push('name = ?');
    params.push(name);
  }
  if (quantity) {
    conditions.push('quantity = ?');
    params.push(quantity);
  }
  if (partnumber) {
    conditions.push('partnumber = ?');
    params.push(partnumber);
  }
  if (location) {
    conditions.push('location = ?');
    params.push(location);
  }
if (startDate && endDate) {
  conditions.push('DATE(createdAt) BETWEEN DATE(?) AND DATE(?)');
  params.push(startDate, endDate);
}
    if (conditions.length === 0) {
    return res.status(400).json({ message: "At least one search parameter is required." });
  }

    const sql = `SELECT * FROM openbalance WHERE ${conditions.join(' AND ')}`;
      DB.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Search error:", err.message);
      return res.status(500).json({ message: `Error searching stock: ${err.message}` });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Such reference does not exist" });
    }

    return res.status(200).json({ searchedStock: rows });
  });
}