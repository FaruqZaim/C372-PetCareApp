const connection = require('../config/db');

function create(username, password, name, role, callback) {
  connection.query(
    'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
    [username, password, name, role], callback
  );
}

function findByCredentials(username, password, callback) {
  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], callback);
}

function findAll(callback) {
  connection.query('SELECT id, name, username, role FROM users', callback);
}

function findById(id, callback) {
  connection.query('SELECT id, name, username, role FROM users WHERE id = ?', [id], callback);
}

function remove(id, callback) {
  connection.query('DELETE FROM users WHERE id = ?', [id], callback);
}

module.exports = { create, findByCredentials, findAll, findById, remove };
