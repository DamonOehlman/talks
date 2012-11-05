eve.on('todolist.refresh', function(todos) { 
  $('ul.todos').html(template(items));
});