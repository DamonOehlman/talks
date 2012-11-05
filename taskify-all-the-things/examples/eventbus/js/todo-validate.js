// wire in a "before" other actions event handler
eve.on('todolist.add.todo', function(todo) {
  // validate the todo
  var vResults = validator.validate(rules.todo, todo);

  // if the 
  if (! vResults.valid) {
    eve.stop();
  }
})(-1);