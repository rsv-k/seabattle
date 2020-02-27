const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.port || 3000;
const seabattleRouter = require('./backend/routes/seabattle');


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use(express.json());
app.use('/api/seabattle', seabattleRouter);


const server = app.listen(port, () => console.log('server is running'));
mongoose.connect('mongodb+srv://Lago:S19A18N18@dictionary-w6e8p.mongodb.net/seabattle?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongodb'));

module.exports = server;
