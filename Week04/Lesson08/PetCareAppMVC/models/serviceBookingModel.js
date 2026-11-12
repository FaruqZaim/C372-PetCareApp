const pool = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  pool.getConnection((connectionError, connection) => {
    if (connectionError) return callback(connectionError);

    let finished = false;
    function finish(error, result) {
      if (finished) return;
      finished = true;
      connection.release();
      callback(error, result);
    }

    function rollbackAndFinish(error, result) {
      connection.rollback((rollbackError) => {
        finish(error || rollbackError, result);
      });
    }

    connection.beginTransaction((transactionError) => {
      if (transactionError) return finish(transactionError);

      const bookingSql = `
        INSERT INTO service_bookings
          (pet_id, service_id, booking_status, booked_price, booking_date)
        SELECT p.id, s.id, 'pending', s.price, ?
        FROM pets AS p
        CROSS JOIN services AS s
        WHERE p.id = ?
          AND p.owner_id = ?
          AND s.id = ?
          AND s.is_active = 1
      `;

      connection.query(
        bookingSql,
        [bookingDate, petId, ownerId, serviceId],
        (bookingError, bookingResult) => {
          if (bookingError) return rollbackAndFinish(bookingError);
          if (bookingResult.affectedRows !== 1) return rollbackAndFinish(null, null);

          const bookingId = bookingResult.insertId;
          const paymentSql = `
            INSERT INTO payments (booking_id, amount, payment_status)
            SELECT id, booked_price, 'pending'
            FROM service_bookings
            WHERE id = ?
          `;

          connection.query(paymentSql, [bookingId], (paymentError, paymentResult) => {
            if (paymentError) return rollbackAndFinish(paymentError);
            if (paymentResult.affectedRows !== 1) {
              return rollbackAndFinish(new Error('Payment record was not created.'));
            }

            connection.commit((commitError) => {
              if (commitError) return rollbackAndFinish(commitError);
              finish(null, { bookingId, paymentId: paymentResult.insertId });
            });
          });
        }
      );
    });
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      sb.id AS booking_id,
      DATE_FORMAT(sb.booking_date, '%Y-%m-%d') AS booking_date,
      p.name AS pet_name,
      s.name AS service_name,
      sb.booked_price,
      sb.booking_status,
      pay.payment_status,
      pay.payment_reference,
      sb.created_at
    FROM service_bookings AS sb
    JOIN pets AS p ON p.id = sb.pet_id
    JOIN services AS s ON s.id = sb.service_id
    LEFT JOIN payments AS pay ON pay.booking_id = sb.id
    WHERE p.owner_id = ?
    ORDER BY sb.created_at DESC, sb.id DESC
  `;
  pool.query(sql, [ownerId], callback);
}

module.exports = { createPendingBooking, getBookingsByOwner };
