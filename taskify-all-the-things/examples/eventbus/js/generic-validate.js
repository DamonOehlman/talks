eve.on('todolist.add.*', function(data) {
  // get the validation rules based on the type of data being added
  var vRules = rules[eve.nt().split('.')[2]],
      vResults = validator.validate(vRules, data);

  // if the 
  if (! vResults.valid) {
    eve.stop();
  }
})(-1);