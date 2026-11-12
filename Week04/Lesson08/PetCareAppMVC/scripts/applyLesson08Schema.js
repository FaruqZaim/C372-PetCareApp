const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const requiredTables = ['services', 'service_bookings', 'payments'];

pool.query(
  `SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = DATABASE()
     AND table_name IN (?, ?, ?)`,
  requiredTables,
  (checkError, rows) => {
    if (checkError) {
      console.error('Unable to inspect the database:', checkError.message);
      return pool.end();
    }

    if (rows.length > 0) {
      console.error('Stopped: Lesson 8 table(s) already exist:', rows.map(row => row.TABLE_NAME || row.table_name).join(', '));
      return pool.end();
    }

    const sqlPath = path.join(__dirname, '..', 'db-lesson08-extension.sql');
    const script = fs.readFileSync(sqlPath, 'utf8');
    const statements = script
      .split(/\r?\n/)
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map(statement => statement.trim())
      .filter(Boolean);

    pool.getConnection((connectionError, connection) => {
      if (connectionError) {
        console.error('Unable to acquire a database connection:', connectionError.message);
        return pool.end();
      }

      let index = 0;
      function runNext() {
        if (index >= statements.length) {
          connection.release();
          console.log('Lesson 8 schema created and eight services inserted.');
          return pool.end();
        }

        connection.query(statements[index], (statementError) => {
          if (statementError) {
            connection.release();
            console.error(`Schema setup stopped at statement ${index + 1}:`, statementError.message);
            return pool.end();
          }
          index += 1;
          runNext();
        });
      }

      runNext();
    });
  }
);
