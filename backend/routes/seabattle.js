const express = require('express');
const router = express.Router();
const { createShips } = require('../modules/seabattle');
const userSchema = require('../schemas/userInfo');

router.get('/:id', (req, res, next) => {
  userSchema.find({_id: req.params.id})
    .then((userInfo) => {
      res.status(200).json({msg: 'user fetched successfully', data: userInfo});
    })
    .catch(() => {
      res.status(404).json({msg: 'user not found'});
    });
});

router.delete('/', (req, res, next) => {
  userSchema.findOne({_id: req.body.id})
    // if user exists make reset ships and shotCells properties
    .then((userInfo) => {
      userInfo.ships = createShips();
      userInfo.shotCells = [];
      userInfo.history.push('New game started');
      
      userInfo = userInfo;
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
      res.status(200).json({msg: 'New game started', id: userInfo._id})
    });
  
});

router.put('/', (req, res, next) => {
  const updatedUserInfo = req.body.updatedUserInfo;
  if (!updatedUserInfo) {
    return;
  }

  updatedUserInfo.history.push(req.body.msg);

  userSchema.findOneAndUpdate({_id: updatedUserInfo._id}, updatedUserInfo, {new: true})
    .then((userInfo) => {
      res.status(200).json({msg: 'userInfo successfully updated', data: userInfo});
    })
    .catch(() => {
      res.status(404).json({msg: 'userInfo is not found'});
    });
});

module.exports = router;