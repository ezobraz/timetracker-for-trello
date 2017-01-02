/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var hourlyrate = document.getElementById('hourlyrate');

t.render(function(){
  return Promise.all([
    t.get('board', 'private', 'hourlyrate')
  ])
  .spread(function(rate){
    if(rate != null) {
      hourlyrate.value = rate;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('board', 'private', 'hourlyrate', hourlyrate.value)
  .then(function(){
    t.closePopup();
  })
})