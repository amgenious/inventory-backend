import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();

const DB = new sql3.Database('./database.db', sqlite3.OPEN_READWRITE, connected);

function connected(err) {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log('Connected to database');
}

let sqlStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS measurement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS supplier (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      contact TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL UNIQUE,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      contact TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL UNIQUE,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      measurement TEXT,
      partnumber TEXT NOT NULL,
      max_stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      quantity INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referencenumber TEXT NOT NULL,
      valuedate TEXT NOT NULL,
      transtype TEXT NOT NULL,
      transcode TEXT NOT NULL,
      customer TEXT NOT NULL,
      remarks TEXT NOT NULL,
      itemname TEXT NOT NULL,
      partnumber TEXT NOT NULL,
      location TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS receipt (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referencenumber TEXT NOT NULL,
      valuedate TEXT NOT NULL,
      transtype TEXT NOT NULL,
      transcode TEXT NOT NULL,
      invoicenumber TEXT NOT NULL,
      invoicedate TEXT NOT NULL,
      supplier TEXT NOT NULL,
      remarks TEXT NOT NULL,
      itemname TEXT NOT NULL,
      partnumber TEXT NOT NULL,
      location TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
     `CREATE TABLE IF NOT EXISTS openbalance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      partnumber TEXT NOT NULL,
      quantity INTERGER DEFAULT 0,
      category TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS stockhistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referencenumber TEXT NOT NULL,
    name TEXT NOT NULL,
    prevQuantity REAL DEFAULT 0,
    addedQuantity REAL DEFAULT 0,
    newQuantity REAL DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  sqlStatements.forEach((stmt) => {
    DB.run(stmt, [], (err) => {
      if (err) {
        console.error('Error running statement:', stmt, '\n', err.message);
      } else {
        console.log('Executed:', stmt.split('(')[0].trim());
      }
    });
  });

export { DB };
