var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Chat = models.Chat;
var Message = models.Message;
var Question = models.Question;

router.post('/api/chats/new', function(req, res) {
  var user = req.user;
  var questionId = req.body.questionId;
  Question.findById(questionId)
    .populate('author')
    .exec(function (err, question) {
    if(err) {
      res.status(400).json(err);
    } else if (!question) {
      res.status(400).json({message: "question doesn't exist"});
    } else {
      var newChat = new Chat({
        question: questionId,
        questioner: question.author._id,
        answerer: user._id,
        closed: false
      });

      // the question asker is sending the message, hence from is set to author
      var newMessage = new Message({
        name: req.user.firstName,
        to: user._id,
        from: question.author._id,
        content: question.content,
        chat: newChat._id
      });
      //question becomes first message in chat
      newChat.messages.push(newMessage._id);

      //chat is associated with question
      question.chat = newChat._id;
      question.state = 'in_progress';
      //chat is associated with current user and participating users
      user.answerChats.push(newChat._id);
      var author = question.author;
      author.questionChats.push(newChat._id);

      newChat.save(function(err) {
        if(err) {
          res.status(400).json(err);
        } else {
          newMessage.save(function(err) {
            if(err) {
              res.status(400).json(err);
            } else {
              question.save(function(err) {
                if(err) {
                  res.status(400).json(err);
                } else {
                  user.save(function(err) {
                    if(err) {
                      res.status(400).json(err);
                    } else {
                      author.save(function(err) {
                        if(err) {
                          res.status(400).json(err);
                        } else {
                          newChat.messages = [newMessage];

                          // send to all users except author
                    			var user_sockets = req.app.settings.user_sockets;
                    			for (var userId in user_sockets) {
                    				if (user_sockets.hasOwnProperty(userId) && !user._id.equals(userId)) {
                    					user_sockets[userId].forEach(function(userSocket) {
                    						userSocket.emit('newChat', {question: question, chat: newChat});
                    					});
                    				}
                    			}
                          res.json(newChat);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});


router.get('/api/chats', function(req, res){

  var chatType;

  if(req.query.kindofchat === 'answers'){
    chatType = req.user.answerChats;
  }else if(req.query.kindofchat === 'questions'){
    chatType = req.user.questionChats;
  }else if(req.query.kindofchat === 'all'){
    chatType = req.user.questionChats.concat(req.user.answerChats);
  }else{
    return res.status(400).json({message: 'Invalid query'});
  }

  Chat.find({_id: {$in: chatType}})
    .populate('messages')
    .exec(function(err, chats){
    if(err){
      res.status(400).json(err);
    }else{
      res.json(chats);
    }
  });
});

router.get('/api/chats/:chatId', function(req, res){

  Chat.findById(req.params.chatId, function(err, chat){
    if(err){
      res.status(400).json(err);
    }else{
      res.json(chat);
    }
  });
});



module.exports = router;
