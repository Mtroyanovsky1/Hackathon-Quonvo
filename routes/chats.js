var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Chat = models.Chat;
var Message = models.Message;
var Question = models.Question;

router.post('/api/chats/new', function(req, res) {
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
        messages: [],
        questioner: question.author,
        answerer: req.user,
        closed: false
      });

      var newMessage = new Message({
        name: req.user.firstName,
        to: question.author._id,
        from: req.user._id,
        content: question.content,
        chat: newChat._id
      });

      question.chat = newChat._id;
      



      // question.chat = newChat._id;
      // // question.save(function(err){
      //   if(err){
      //     res.status(400).json(err);
      //   }else{




      //     // req.user.answerChats.push(newChat._id);
      //     // User.findById(question.author._id, function (err, user) {
      //     //   if(err) {
      //     //     res.status(400).json(err)
      //     //   } else{
      //     //     user.questionChats.push(newChat._id);

      //     //     newChat.messages.push(question._id);

      //     //     newChat.save(function(err){

      //     //       if(err){
      //     //         res.status(400).json(err);
      //     //       } else{
      //     //         res.send(newChat);




      //     //       }
      //     //     });
      //     //   }
      //     // });
      //   }
      // });
    }
  })
});



module.exports = router;
