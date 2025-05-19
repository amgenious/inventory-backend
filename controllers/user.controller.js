import { DB } from "../connect.js";
import bcrypt from 'bcrypt';

export const addUser = async(req,res) => {
    const { name, email, pass, role } = req.body;

    if (!name || !email || !pass || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
     const checkSql = 'SELECT * FROM users WHERE email = ?'
     DB.get(checkSql, [email], async (err, row) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Database error' });
        }
    
        if (row) {
          return res.status(409).json({ message: 'User already exists' });
        }
    
        // Hash password
        try {
          const salt = await bcrypt.genSalt(10);
          const password = await bcrypt.hash(pass, salt);
    
          // Insert user
          const insertSql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
          DB.run(insertSql, [name, email, password, role], function (insertErr) {
            if (insertErr) {
              console.error(insertErr.message);
              return res.status(500).json({ message: 'Failed to create user' });
            }
    
            return res.status(201).json({
              message: 'User created successfully',
              userId: this.lastID,
            });
          });
        } catch (hashErr) {
          console.error(hashErr.message);
          return res.status(500).json({ message: 'Error hashing password' });
        }
      });
}
export const getAllUsers = async(req,res) => {
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM users';
    let data = { user: [] };
    try {
      DB.all(sql, [], (err, rows) => {
        if (err) {
          throw err; 
        }
        rows.forEach((row) => {
          data.user.push({ id: row.id, name: row.name, email: row.email, role: row.role });
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
export const deleteUser = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const sql = 'DELETE FROM users WHERE id=?';
    try {
      DB.run(sql, [id], function (err) {
        if (err) throw err;
        if (this.changes === 1) {
          //one item deleted
          res.status(200);
          res.send(`{"message":"User ${req.query.id} was removed from list."}`);
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
export const updateUser = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    const { name,email,role } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const sql  = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    DB.run(sql, [name,email,role, id], function (err) {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: `Error updating user: ${err.message}` });
      }
  
      if (this.changes === 0) {
        return res.status(400).json({ message: "User update not successful" });
      }
  
      res.status(200).json({ message: "User updated successfully" });
    });
}
export const updateUserpassword = async(req,res) => {
    res.set('content-type', 'application/json');
    const id = parseInt(req.params.id, 10);
    const { pass } = req.body;

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(pass, salt);

    const sql  = 'UPDATE users SET password = ? WHERE id = ?';
    DB.run(sql, [password,id], function (err) {
      if (err) {
        console.error('Error updating user password:', err);
        return res.status(500).json({ message: `Error updating user password: ${err.message}` });
      }
  
      if (this.changes === 0) {
        return res.status(400).json({ message: "User password update not successful" });
      }
  
      res.status(200).json({ message: "User password updated successfully" });
    });
}