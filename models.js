var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  phone: String
});

var questionSchema = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		required: 'title is required'
	},
	content: {
		type: String,
		required: 'content is required'
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'author is required'
	},
	subject: {
		type: String,
		enum: ['html', 'css', 'javascript', 'node', 'jquery', 'general'],
		default: 'general'
	}
});


User = mongoose.model('User', userSchema);
Question = mongoose.model('Question', questionSchema);

module.exports = {
    User:User,
    Question: Question
};
