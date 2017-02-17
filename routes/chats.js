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
      //TODO create a new message from the req.body.content
      var newChat = new Chat({
        question: questionId,
        messages: [],
        questioner: question.author,
        answerer: req.user,
        closed: true,
      })
      question.chat = newChat._id;
      req.user.answerChats.push(newChat._id);
      User.findById(question.author, function (err, user) {
        if(err) {
          res.status(400).json(err)
        } else
        user.questionChats.push(newChat._id);
        //Check where user object was created to see whether an empty array was
        //created. The part you're at right now you just added the chat to
        //both users
      })
    }
  })
});



module.exports = router;
