var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Question = models.Question;


router.get('/api/questions', function(req, res){
	Question.find({}, function(err, questions) {
		if (err) {
			res.status(400).json(err);
		} else {
			res.json(questions);
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
	var question = new Question(req.body);
	question.author = req.user;
	
	question.save(function(err) {
		if (err) {
			res.status(400).json(err);
		} else {
			res.json(question);
		}
	});
});

module.exports = router;
