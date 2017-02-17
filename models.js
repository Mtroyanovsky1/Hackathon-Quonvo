var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
  username: {
		type: String
	},
  password: {
		type: String
	},
  firstName: {
		type: String,
	},
	lastName: {
		type: String
	},
	questions: [{
		type: Schema.ObjectId,
		ref: 'Question'
	}],
	questionChats: [{
		type: Schema.ObjectId,
		ref: 'Chat'
	}],
	answerChats: [{
		type: Schema.ObjectId,
		ref: 'Chat'
	}],
	rating: {
		type: Number
	}
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
	label: {
		type: String,
		enum: ['html', 'css', 'javascript', 'node', 'jquery', 'general'],
		default: 'general'
	},
	chat: {
		type: Schema.ObjectId,
		ref: 'Chat'
	},
	state: {
		type: 'String',
		enum: ['open', 'closed', 'in_progress'],
		default: 'open'
	}
});

var chatSchema = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	question: {
		type: Schema.ObjectId,
		ref: 'Question'
	},
	rating: {
		type: Number
	},
	messages: [{
		type: Schema.ObjectId,
		ref: 'Message'
	}],
	questioner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	answerer: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	closed: {
		type: Boolean,
		required: true
	}
});

var messageSchema = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
	},
	to: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	from: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		required: 'content is required'
	},
	chat: {
		type: Schema.ObjectId,
		ref: 'Chat'
	}
});


var User = mongoose.model('User', userSchema);
var Question = mongoose.model('Question', questionSchema);
var Chat = mongoose.model('Chat', chatSchema);
var Message = mongoose.model('Message', messageSchema);

module.exports = {
    User:User,
    Question: Question,
    Chat: Chat,
    Message: Message
};
