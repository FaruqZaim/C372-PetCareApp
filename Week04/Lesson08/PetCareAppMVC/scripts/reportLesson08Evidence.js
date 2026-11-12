const pool = require('../config/db');

const sql = `
  SELECT
    sb.id AS booking_id,
    u.username,
    p.name AS pet_name,
    s.name AS service_name,
    DATE_FORMAT(sb.booking_date, '%Y-%m-%d') AS booking_date,
    sb.booked_price,
    sb.booking_status,
    pay.id AS payment_id,
    pay.amount,
    pay.payment_status
  FROM service_bookings AS sb
  JOIN pets AS p ON p.id = sb.pet_id
  JOIN users AS u ON u.id = p.owner_id
  JOIN services AS s ON s.id = sb.service_id
  LEFT JOIN payments AS pay ON pay.booking_id = sb.id
  WHERE u.username = 'clara'
  ORDER BY sb.id
`;

pool.query(sql, (error, rows) => {
  if (error) {
    console.error('Unable to read Lesson 8 evidence:', error.message);
    process.exitCode = 1;
  } else {
    console.table(rows);
  }
  pool.end();
});
