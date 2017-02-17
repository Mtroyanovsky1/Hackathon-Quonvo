var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Chat = models.Chat;
var Message = models.Message;
var Question = models.Question;

router.get('/api/messages/:chatId', function(req, res) {
  var chatId = req.params.chatId;
  Chat.findById(chatId)
   .populate('messages')
   .exec(function(err, chat) {
    if(err) {
      res.status(400).json(err);
    } else if (!chat) {
      res.status(400).json({message: "chat not found"});
    } else {
      res.json(chat.messages);
    }
  });
});


router.post('/api/messages/new', function(res, req) {
  //post request must include {
  // toId: ObjectId,
  // content: String,
  // chatId: ObjectId
  //
  // }
  var newMessage = new Message({
    to: req.body.toId,
    from: req.user._id,
    content: req.body.content,
    chat: req.body.chatId
  });

  Chat.findById(req.body.chatId, function(err, chat) {
    if(err) {
      res.status(400).json()
    } else if (!chat) {
      res.status(400).json({message: "chat not found"});
    } else {
      chat.messages.push(newMessage._id);
      newMessage.save(function(err) {
        if(err) {
          res.status(400).json(err);
        } else {
          res.json(newMessage);
        }
      });
    }
  });
});

module.exports = router;
