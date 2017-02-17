var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Question = models.Question;


router.get('/api/questions', function(req, res){
	Question.find({state: 'open'}, function(err, questions) {
		if (err) {
			res.status(400).json(err);
		} else {
			res.json(questions);
		}
	});
});


router.get('/api/questions/open', function(req, res) {
	Question.find({state: 'open'})
	 .populate('chat')
	 .exec(function(err, questions) {
		if (err) {
			res.status(400).json(err);
		} else {
			res.json(questions);
		}
	});
})




router.get('/api/questions/in_progress', function(req, res) {
	Question.find({state: 'in_progress'})
	 .populate('chat')
	 .exec(function(err, questions) {
		if (err) {
			res.status(400).json(err);
		} else {
			res.json(questions);
		}
	});
})


router.get('/api/questions/:questionId/close', function(req, res) {
	var questionId = req.params.questionId;

	Question.findByIdAndUpdate(questionId, {state: 'closed'}, function(err, question) {
		if (err) {
			res.status(400).json(err);
		} else if (!question) {
			res.status(404).json({
				message: "no question with that id"
			});
		} else {
			res.json(question);
		}
	});
});

router.get('/api/questions/:questionId', function(req, res){
	var questionId = req.params.questionId;

	Question.findById(questionId, function(err, question) {
		if (err) {
			res.status(400).json(err);
		} else if (!question) {
			res.status(404).json({
				message: "no question with that id"
			});
		} else {
			res.json(question);
		}
	});
});

router.post('/api/questions/new', function(req, res){
	var question = new Question({
		title: req.body.title,
		content: req.body.content,
		author: req.user._id,
		label: req.body.label
	});

	question.save(function(err) {
		if (err) {
			res.status(400).json(err);
		} else {
			// send to all users except author
			var user_sockets = req.app.settings.user_sockets;
			for (var userId in user_sockets) {
				if (user_sockets.hasOwnProperty(userId) && !req.user._id.equals(userId)) {
					user_sockets[userId].forEach(function(userSocket) {
						userSocket.emit('appendQuestion', question);
					});
				}
			}
			res.json(question);
		}
	});
});

module.exports = router;
