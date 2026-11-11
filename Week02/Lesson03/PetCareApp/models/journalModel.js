const connection = require('../config/db');

function findByOwnerAndPet(ownerId, petId, callback) {
  const sql = `
    SELECT journal.*, pets.name, pets.species, pets.breed, pets.age, pets.image
    FROM journal
    JOIN pets ON journal.pet_id = pets.id
    WHERE pets.owner_id = ? AND pets.id = ?
  `;
  connection.query(sql, [ownerId, petId], callback);
}

function create(petId, activity, notes, entryDate, callback) {
  connection.query('INSERT INTO journal (pet_id, activity, notes, entry_date) VALUES (?, ?, ?, ?)', [petId, activity, notes, entryDate], callback);
}

function findById(id, callback) {
  connection.query('SELECT * FROM journal WHERE id = ?', [id], callback);
}

function update(id, entryDate, activity, notes, petId, callback) {
  connection.query('UPDATE journal SET entry_date = ?, activity = ?, notes = ?, pet_id = ? WHERE id = ?', [entryDate, activity, notes, petId, id], callback);
}

function findPetId(id, callback) {
  connection.query('SELECT pet_id FROM journal WHERE id = ?', [id], callback);
}

function remove(id, callback) {
  connection.query('DELETE FROM journal WHERE id = ?', [id], callback);
}

function findByOwner(ownerId, callback) {
  const sql = `
    SELECT journal.*, pets.id AS pet_id
    FROM journal
    JOIN pets ON journal.pet_id = pets.id
    WHERE pets.owner_id = ?
  `;
  connection.query(sql, [ownerId], callback);
}

function search(ownerId, searchQuery, selectedPetId, callback) {
  let sql = `
    SELECT journal.*, pets.name, pets.species, pets.breed, pets.age, pets.image
    FROM journal
    JOIN pets ON journal.pet_id = pets.id
    WHERE pets.owner_id = ? AND (journal.activity LIKE ? OR journal.notes LIKE ?)`;
  const params = [ownerId, searchQuery, searchQuery];
  if (selectedPetId) {
    sql += ' AND pets.id = ?';
    params.push(selectedPetId);
  }
  connection.query(sql, params, callback);
}

module.exports = { findByOwnerAndPet, create, findById, update, findPetId, remove, findByOwner, search };
