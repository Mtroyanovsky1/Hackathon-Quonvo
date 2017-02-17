// YOUR JS CODE FOR ALL PAGES GOES HERE
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



