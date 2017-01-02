/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

/* elements */
var buttonStart = document.getElementById('buttonStart');
var buttonStop = document.getElementById('buttonStop');
var timePlace = document.getElementById('timePlace');

/* timer setup */
var totalSeconds = 0;
var totalSecondsBoard = 0;
var totalSecondsCard = 0;
var timerVar = null;

t.render(function(){
  return Promise.all([
    t.get('card', 'private', 'timer_started'),
    t.get('card', 'private', 'time_total'),
    t.get('board', 'private', 'time_total_board')
  ])
  .spread(function(startedTime, cardTime, boardTime){

    if(cardTime != null) {
      totalSecondsCard = cardTime;
    } else {
      totalSecondsCard = 0;
    }

    if(boardTime != null) {
      totalSecondsBoard = boardTime;
    } else {
      totalSecondsBoard = 0;
    }

    if(startedTime != null) {
      buttonStart.style.display = 'none'; 
      buttonStop.style.display = 'block'; 

      totalSeconds = Math.round((new Date() / 1000) - startedTime + totalSecondsCard);
      timerVar = setInterval(countTimer, 1000);

    } else {
      if(cardTime != null) {
        totalSeconds = cardTime;
      } else {
        totalSeconds = 0;
      }

      var hour = Math.floor(totalSeconds /3600);
      var minute = Math.floor((totalSeconds - hour*3600)/60);
      var seconds = totalSeconds - (hour*3600 + minute*60);
      var hourOutput = hour;
      if(hour < 10) { hourOutput = '0' + hour }

      var minuteOutput = minute;
      if(minute < 10) { minuteOutput = '0' + minute }

      var secondsOutput = seconds;
      if(seconds < 10) { secondsOutput = '0' + seconds }

      timePlace.innerHTML = hourOutput + ":" + minuteOutput + ":" + secondsOutput;
    }

  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});


buttonStart.addEventListener('click', function() {
  buttonStart.style.display = 'none'; 
  buttonStop.style.display = 'block'; 

  timerVar = setInterval(countTimer, 1000);
  var new_timeStarted = Math.round(new Date() / 1000);
  
  return t.set('card', 'private', { 'timer_started': new_timeStarted });
});

buttonStop.addEventListener('click', function() {
  buttonStop.style.display = 'none'; 
  buttonStart.style.display = 'block';

  var updateBoardSecond = totalSecondsBoard + (totalSeconds - totalSecondsCard);

  return t.set('card', 'private', { 'timer_started': null, 'time_total':  totalSeconds })
  .then(function() {
    t.set('board', 'private', 'time_total_board', updateBoardSecond)
    .then(function() {
      clearInterval(timerVar);
      timerVar = null;
    });
  });

});

function countTimer() {
   ++totalSeconds;
   var hour = Math.floor(totalSeconds /3600);
   var minute = Math.floor((totalSeconds - hour*3600)/60);
   var seconds = totalSeconds - (hour*3600 + minute*60);

   var hourOutput = hour;
   if(hour < 10) { hourOutput = '0' + hour }

   var minuteOutput = minute;
   if(minute < 10) { minuteOutput = '0' + minute }

   var secondsOutput = seconds;
   if(seconds < 10) { secondsOutput = '0' + seconds }

   timePlace.innerHTML = hourOutput + ":" + minuteOutput + ":" + secondsOutput;
}
