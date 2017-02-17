// YOUR JS CODE FOR ALL PAGES GOES HERE

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
			console.log(result);
		}
	});

});



