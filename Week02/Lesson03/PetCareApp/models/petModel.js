const connection = require('../config/db');

function create(ownerId, name, species, breed, age, image, callback) {
  connection.query(
    'INSERT INTO pets (owner_id, name, species, breed, age, image) VALUES (?, ?, ?, ?, ?, ?)',
    [ownerId, name, species, breed, age, image], callback
  );
}

function findByOwner(ownerId, callback) {
  connection.query('SELECT * FROM pets WHERE owner_id = ?', [ownerId], callback);
}

module.exports = { create, findByOwner };
