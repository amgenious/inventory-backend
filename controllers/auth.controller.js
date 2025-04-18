import { DB } from "../connect.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const signIn = async(req,res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = 'SELECT id, name, email, password, role FROM users WHERE email = ?';

    DB.get(sql, [email], async (err, user) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Database error', error: err });
        }
    
        if (!user) {
          return res.status(404).json({ message: 'User does not exist' });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (isMatch) {
          const token = jwt.sign({ userid: user.id }, 'newsecret', {
            expiresIn: '5h',
          });
    
          // Exclude password from returned user info
          const { password: _, ...userInfo } = user;
    
          return res.status(200).json({ token, userInfo });
        } else {
          return res.status(401).json({ message: 'Wrong Password' });
        }
      });

}