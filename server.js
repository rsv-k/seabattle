const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.port || 3000;
const seabattleRouter = require('./backend/routes/seabattle');

app.use(express.json());
app.use('/api/seabattle', seabattleRouter);


app.listen(port, () => console.log('server is running'));
mongoose.connect('mongodb+srv://Lago:S19A18N18@dictionary-w6e8p.mongodb.net/seabattle?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongodb'));