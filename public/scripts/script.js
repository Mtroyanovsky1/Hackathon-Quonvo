// YOUR JS CODE FOR ALL PAGES GOES HERE

//Add modal animations
$('.modal-background').hide();
$('.modal').hide();

$('#add-question-button').click(function() {
	$('.modal-background').show();
	$('.modal').fadeIn('slow');
})

$('.modal-background').click(function() {
	$('.modal').fadeOut('fast');
	$('.modal-background').hide();
})

$('.fa-times').click(function() {
	$('.modal').fadeOut('fast');
	$('.modal-background').hide();
})

/*
Handling clicking on a question in question-list
*/
var myUserId;

var currentChat;
var allChats;
var allQuestions;
var inProgressQuestions;
var questionChats;
var answerChats; // /api/chats?kindofchat=answers

//***********
//sockets stuff
var socket = io();

// get my user Id from server on first connection
socket.on('onConnect', function(userId){
	console.log("userid", userId);
	myUserId = userId;
});

// server notifies all users when new question was added
socket.on('appendQuestion', function(questionObj) {
	var questionStr = $(questionDivBuilder(questionObj));
	$('.questions-list').append(questionStr);
	questionStr.hide().show('slow');
});

// server notifies all users to remove question
socket.on('newChat', function(data) {
	$('.questions-list').children('.question').each(function(i) {
		if ($(this).children('.question-id').text() === data.question._id) {
			$(this).hide('slow');
			currentChat = data.chat;
			allChats.push(data.chat);
			updateChatTabs();
			displayChat();
		}
	});
});

// server notifies recipient
socket.on('getMessage', function(message) {
	var m = $(messageFromDiv(message));
	allChats.forEach(function(chat) {
		if (chat._id === message.chat) {
			allChats[allChats.indexOf(chat)].messages.push(message);
		}
		if (currentChat._id === message.chat) {
			$('.chat-main').append(m);
			m.hide().show('fast');
		}
	});
});

// convert question chat to a chat tab
var questionChatToTab = function(chat) {
	return '<div class="chat-head"> \
          	<div class="chat-id"></div> \ ' +
						'<div style="display:none" class="chatId">'+
			 				chat._id +
						'</div>' +
          	'<div class="fa fa-user-circle fa-4x question-chat-head"></div> \
        	</div>';
};

// convert answer chat to a chat tab
var answerChatToTab = function(chat) {
	return '<div class="chat-head"> \
          	<div class="chat-id"></div> \ ' +
						'<div style="display:none" class="chatId">'+
			 				chat._id +
						'</div>' +
          	'<div class="fa fa-user-circle fa-4x answer-chat-head"></div> \
        	</div>';
};

var updateChatTabs = function() {
	$('.chat-list').empty();
	allChats.forEach(function(chat) {
		if (chat.questioner === myUserId && !chat.closed) {
			$('.chat-list').append(questionChatToTab(chat));
		} else {
			$('.chat-list').append(answerChatToTab(chat));
		}
	});
};

// displayChat
var displayChat = function() {
	$('.chat-main').empty();
	if (!currentChat) return false;
	currentChat.messages.forEach(function(message) {
		console.log(message.to, myUserId);
			if (message.to === myUserId) {
				$('.chat-main').append(messageFromDiv(message));
			} else {
				$('.chat-main').append(messageToDiv(message));
			}
	});
};

$('.chat-list').on('click', '.chat-head', function(event) {
	event.preventDefault();
	var currentChatId = $(this).children('.chatId').text();
	currentChat = allChats.filter(function(chat) {
		return chat._id === currentChatId;
	})[0];

	displayChat();
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
		if (chats.length >= 0) {
			currentChat = chats[0];
			displayChat();
		}
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
		if (!currentChat && chats.length >= 0) {
			currentChat = chats[0];
			displayChat();
		}
	}
});

/*
Making an ajax call to populate questionChats global array
*/
$.ajax({
	url: '/api/chats?kindofchat=all',
	success: function(chats) {
		console.log("allChats", chats);
		allChats = chats;
		updateChatTabs();
	}
});

// new question submission handler
$('#q-button').on('click', function(event) {
	$.ajax({
		url: '/api/questions/new',
		type: 'POST',
		data: {
			content: $('#q-input').val(),
			label: $('#label-select').val()
		},
		success: function(question) {
			console.log(question);
			$('.modal').hide('fast');
			$('.modal-background').hide();
			var questionStr = $(questionDivBuilder(question));
			$('.questions-list').append(questionStr);
			questionStr.hide().show('slow');
		},
		error: function(error) {
			console.log("fuck", error);
		}

	})
});

// add tabs for questions that are current in_progress


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
	$(this).hide('slow');

	// create new chat for the question
	$.ajax({
		type: "POST",
		data: {questionId: $(this).children('.question-id').text()},
		url: '/api/chats/new',
		success: function(chat){
			currentChat = chat;
			allChats.push(chat);
			updateChatTabs();
			displayChat();
		}
	});

});

/*
Handling sending a message in currentChat
*/
$('#send-button').on('click', function(){
	if (!currentChat || $('#message-body').val() === '') return false;

	// if ($('#message-body').val().includes('script')) return false;
	// if ($('#message-body').val().includes('<')) return false;
	// if ($('#message-body').val().includes('>')) return false
	$('#message-body').val($('#message-body').val().replace("script", ""));

	console.log($('#message-body').val());

	var messageContents = $('#message-body').val();
	$('#message-body').val('');

	var toId = currentChat.questioner !== myUserId ? currentChat.questioner : currentChat.answerer;

	$.ajax({
		type: 'POST',
		url: '/api/messages/new',
		data: {
			toId: toId,
			content: messageContents,
			chatId: currentChat._id
		},
		success: function(message){
			var m = $(messageToDiv(message));
			allChats.forEach(function(chat) {
				if (chat._id === message.chat) {
					allChats[allChats.indexOf(chat)].messages.push(message);
				}
				if (currentChat._id === message.chat) {
					$('.chat-main').append(m);
					m.hide().show('fast');
				}
			});
		}
  });
});
