// YOUR JS CODE FOR ALL PAGES GOES HERE

/*
Handling clicking on a question in question-list
*/

var currentChatId;
var currentQuestioner;

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


$('.questions-list').on('click', '.question', function(event){
	event.preventDefault();
	
	// var question = $(this).children('.question-body-container').text();
	// console.log($(this).children('.question-body-container').text());
	$.ajax({

		type: "POST",
		data: {questionId: $(this).children('.question-id').text()},
		url: '/api/chats/new',
		success: function(result){

			currentChatId = result._id;
			currentQuestioner = result.questioner;
			// the first message Id of the chat is in results.messge[0]
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


