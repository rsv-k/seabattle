const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cell = new Schema({
  x: Number,
  y: Number,
  value: Number,
  condition: String,
}, {_id: false});

module.exports = mongoose.model('usersInfo', new Schema({
  ships: [[cell]],
  shotCells: [cell],
  history: [String]
}));