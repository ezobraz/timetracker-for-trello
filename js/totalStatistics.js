/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

/* elements */
var timePlaceTotal = document.getElementById('timePlaceTotal');
var moneyPlace = document.getElementById('moneyPlace');
var localTimeSpent = document.getElementById('timeSpent');
var localMoneyEarn = document.getElementById('moneyEarn');
var buttonReset = document.getElementById('buttonReset');

/* timer setup */

t.render(function(){
  return Promise.all([
    t.get('board', 'private', 'time_total_board'),
    t.get('board', 'private', 'hourlyrate')
  ])
  .spread(function(boardTimeTotal, rate){

    if(boardTimeTotal != null) {

      var sec_num = boardTimeTotal;
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      
      var hourlyrate = 0;

      if(rate != null) {
        hourlyrate = rate;
      }
      
      var money = hourlyrate * (boardTimeTotal / 3600);

      timePlaceTotal.innerHTML = hours+':'+minutes+':'+seconds;
      moneyPlace.innerHTML = money.toFixed(2)+'$';

    }

  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});


buttonReset.addEventListener('click', function() {
  var reset_confirm = confirm("Are you sure you want to Reset the total statistics data? Time spent on cards will still be available.");
  
  if(reset_confirm == true) {
    timePlaceTotal.innerHTML = '00:00:00';
    moneyPlace.innerHTML = '0$';
    return t.set('board', 'private', 'time_total_board', null);
  }
});
