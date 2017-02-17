// YOUR JS CODE FOR ALL PAGES GOES HERE

/*
Handling clicking on a question in question-list
*/
var myUserId;

var currentChat;
var currentQuestioner;
var allQuestions;

var questionChats;
var answerChats; // /api/chats?kindofchat=answers

//***********
//sockets stuff
var socket = io();

socket.on('connected', function(data){
	console.log('SHIT!!!!!!!!!!!');
});

socket.on('onConnect', function(userId){
	console.log("userid", userId);
	myUserId = userId;
});

// build question DOM element
function questionDivBuilder(questionObj){
	var str = '';
	var str = '<div class="question"><div class="question-id">' + questionObj._id + '</div>';
	str += '<div class="question-title">';
	str += '<span id="label" class="' + questionObj.label + '-class">' + questionObj.label + '</span>';
	str += '</div>';
	str += '<div class="question-author" style="display: none;">' + questionObj.author + '</div>';
	str += '<div class="question-body-container">';
	str += questionObj.content;
	str += '</div></div>';
	return str;
};

/*
Making an ajax call to populate allQuestions global array
*/
$.ajax({
	url: '/api/questions',
	success: function(assholes){
		allQuestions = assholes;
		console.log('Retrieved questions: ', allQuestions);
		allQuestions.forEach(function(question){
			var questionStr = questionDivBuilder(question);
			$('.questions-list').append(questionStr);
		});
	}
});

/*
Making an ajax call to populate answerChats global array
*/
$.ajax({
	url: '/api/chats?kindofchat=answers',
	success: function(chats) {
		console.log("answerChats", chats)
		answerChats = chats
	}
});

/*
Making an ajax call to populate questionChats global array
*/
$.ajax({
	url: '/api/chats?kindofchat=questions',
	success: function(chats) {
		console.log("questionChats", chats);
		questionChats = chats
	}
})

// new question submission handler
$('.question_submit').on('click', function(event) {
	$.ajax({
		url: '/api/questions/new',
		type: 'POST',
		data: {
			title: $('input[name=title]').val(),
			content: $('input[name=content]').val(),
			label: $('input[name=label]').val()
		},
		success: function(question) {
			console.log(question);
			var questionStr = $(questionDivBuilder(question));
			$('.questions-list').append(questionStr);
			questionStr.hide().show('slow');
		},
		error: function(error) {
			console.log("fuck", error);
		}

	})
});


// add blue bubble message in chat from current user
var messageToDiv = function(message) {
	return `<div class="clear"></div><div class="from-me">${message.content}</div>`;
};

// add gray bubble message from recipient
var messageFromDiv = function(message) {
		return `<div class="clear"></div><div class="from-them">${message.content}</div>`;
};

// handle clicking on a question
$('.questions-list').on('click', '.question', function(event){
	event.preventDefault();

	// prevent creating chat for own question
	if (myUserId === $(this).children('.question-author').text()) {
		console.log('clicked own thing');
		return false;
	}

	// fade out the question
	$(self).hide('slow');

	// create new chat for the question
	$.ajax({
		type: "POST",
		data: {questionId: $(this).children('.question-id').text()},
		url: '/api/chats/new',
		success: function(result){
			currentChat = result;
			currentQuestioner = result.questioner;

			$('.chat-main').append(messageFromDiv(result.messages[0]));
			// the first message Id of the chat is in results.message[0]
			console.log(result);
		}
	});

});

/*
Handling clicking on a question in question-list
*/
$('#send-button').on('click', function(){

	console.log($('#message-body').val());

	var messageContents = $('#message-body').val();
	$('#message-body').val('');

	console.log('HIT HERE!!!!!!!!!!!!!!!!!!');
	console.log(currentChatId);
	console.log(currentQuestioner);

	$.ajax({

		type: "POST",
		data: {
			toId: currentQuestioner,
			content: messageContents,
			chatId: currentChatId
		},
		url: '/api/messages/new',
		success: function(result){

			$('.chat-main').append('<div class="clear"></div>');
			$('.chat-main').append(`<div class="from-them">${result.content}</div>`);
		}
  	});
});
