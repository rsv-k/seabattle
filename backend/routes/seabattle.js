const express = require('express');
const router = express.Router();
const { createShips } = require('../modules/seabattle');
const userSchema = require('../schemas/userInfo');

router.get('/:id', (req, res, next) => {
  userSchema.findOne({_id: req.params.id})
    .then((userInfo) => {
      res.status(200).json({msg: 'userInfo fetched successfully', data: userInfo});
    })
    .catch(() => {
      res.status(404).json({msg: 'userInfo not found', data: null});
    });
});

router.delete('/:id', (req, res, next) => {
  userSchema.findOne({_id: req.params.id})
    // if user exists make reset ships and shotCells properties
    .then((userInfo) => {

      userInfo.ships = createShips();
      userInfo.shotCells = [];
      userInfo.history.push('New game started');
      
      return userInfo.save();
    })
    // if user doesn't exit than create one
    .catch(() => {
  
      const ships = createShips();
      const userInfo = new userSchema({
        ships,
        shotCells: [],
        history: ['New game started']  
      });
      
      return userInfo.save();
    })
    .then((userInfo) => {
      res.status(200).json({msg: 'New game started', data: userInfo})
    });
  
});

router.put('/', (req, res, next) => {
  const updatedUserInfo = req.body.updatedUserInfo;
  
  if (!updatedUserInfo) {
    return res.status(400).json({msg: 'No content provided'});
  }

  userSchema.findOneAndUpdate({_id: updatedUserInfo._id}, updatedUserInfo, {new: true, useFindAndModify: false})
    .then((userInfo) => {
      res.status(200).json({msg: 'userInfo successfully updated'});
    })
    .catch(() => {
      res.status(404).json({msg: 'userInfo is not found'});
    });
});

module.exports = router;