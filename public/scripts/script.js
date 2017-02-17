// YOUR JS CODE FOR ALL PAGES GOES HERE

/*
Handling clicking on a question in question-list
*/

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

socket.on('message', function(data){
	console.log(data);
});
//***********

/*
Making an ajax call to populate allQuestions global array
*/
$.ajax({
	url: '/api/questions',
	success: function(assholes){
		allQuestions = assholes;
		console.log('Retrieved questions: ', allQuestions);
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
		},
		error: function(error) {
			console.log("fuck", error);
		}

	})
});

//function to replace the view html


var messageToDiv = function(message) {
	return `<div class="from-me">${message.content}</div>`;
};

var messageFromDiv = function(message) {
		return `<div class="to-me">${message.content}</div>`;
};



$('.questions-list').on('click', '.question', function(event){
	event.preventDefault();

	// var question = $(this).children('.question-body-container').text();
	// console.log($(this).children('.question-body-container').text());
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



			/*

				<div class="chat-main">
					<div class="clear"></div>
			        <div class="from-them">
			          Hello, this is RICKY SHAAAARMAAAAA
			        </div>
			*/
		}
  	});
});
