function setStopButton() {
  $("#start-stop").removeClass("start");
  $("#start-stop").addClass("stop");    
  $("#start-stop").html("STOP");
}

function setStartButton() {
  $("#start-stop").removeClass("stop");
  $("#start-stop").addClass("start");
  $("#start-stop").html("GO");
}

function resetLastSetting() {
  var timerIsRunning = $("#start-stop").hasClass("stop");
  //console.log(typeof $("#pom-minutes").text()); // why here a string
  var minutes = parseInt($("#pom-minutes").text());
  minutes = minutes < 10 ? "0" + minutes : minutes;
  
  $("#countdown").html(minutes + ":00");
  $("#pomodoro, #break").removeClass("selected");

  if (timerIsRunning) {
    setStartButton();
    clearInterval($("#start-stop").data("intervalId"));
  }
}

function startNextSession(previousSession) {
  var display = $("#countdown"); 
  var nextSession;
  
  if (previousSession === "pomodoro") {
    var breakSeconds = ($("#break-minutes").text())*60; //why typeof number?
    nextSession = "break";
    $("#pomodoro").removeClass("selected");  
    $("#break").addClass("selected");
    startTimer(breakSeconds, display, nextSession);
    
  } else {
    var pomSeconds = ($("#pom-minutes").text())*60; // why typeof number?
    nextSession = "pomodoro";
    $("#break").removeClass("selected");
    $("#pomodoro").addClass("selected");
    startTimer(pomSeconds, display, nextSession);
  }
}

function playAlarm(typeSession) {  
  var audio = new Audio('http://www.freespecialeffects.co.uk/soundfx/clocks/clock_chime.wav');  
  audio.volume = 0.1;
  audio.play();
  setTimeout(function() {startNextSession(typeSession)}, 5500);
} 

function startTimer(SecondsSession, display, typeSession) {
  var timer = SecondsSession;
  var interval = setInterval(function() {
      var minutes = parseInt(timer / 60, 10);
      var seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      display.text(minutes + ":" + seconds);

      if (--timer < 0) {
        playAlarm(typeSession);
        clearInterval(interval);

      } else if (timer < SecondsSession) {
        $("#start-stop").data("min", parseInt(minutes));
        $("#start-stop").data("sec", parseInt(seconds));
        $("#start-stop").data("session", typeSession);
        $("#start-stop").data("intervalId", interval);
      }
    
  }, 1000);
}

function isTheBeginningOfSession() {
  var duration = $("#pom-minutes").text(); //why here string
  var currentValue = $("#countdown").html();
  var defaultValue = (duration.length === 1) ? "0" + duration + ":00" : duration + ":00";
  return defaultValue === currentValue;
}

function checkButtonStatus(Session) {
  return function(event) {
    var clicked = $(event.target);
    var display = $("#countdown");
    var hasClassStart = $(event.target).hasClass("start");
    var isTheStart = isTheBeginningOfSession();

    if (hasClassStart && isTheStart) {   
      var pomSeconds = ($("#pom-minutes").text())*60;
      $("#pomodoro").addClass("selected");
      setStopButton();
      startTimer(pomSeconds, display, Session);

    } else if (hasClassStart) {
        var session = clicked.data("session");
        var restartPoint = (clicked.data("min") * 60) + clicked.data("sec");
        setStopButton();
        startTimer(restartPoint, display, session);
    
    } else {
        var interval = clicked.data("intervalId");
        setStartButton();
        clearInterval(interval);
    }
  }
} 

function reduceMin(minutesId) {
  return function(event) {
    var minStr = $(minutesId).text();
    var min = parseInt(minStr);
    if (min > 1) {
      $(minutesId).text(min-1);
    }  
  }
}

function addMin(minutesId) {
  return function(event) {
    var minStr = $(minutesId).text();
    var min = parseInt(minStr);
    if (min < 60) {
      $(minutesId).text(min+1);
    }  
  }
}

function setUpPage() {
  var pomDefault = 25;
  var breakDefault = 5;
  $("#pom-minutes").html(pomDefault);
  $("#break-minutes").html(breakDefault);
  $("#countdown").html(((pomDefault < 10) ? "0" + pomDefault : pomDefault) + ":00");
}

function main() {
  setUpPage();    
  $("#pom-minus").click(reduceMin("#pom-minutes"));
  $("#break-minus").click(reduceMin("#break-minutes")); 
  $("#pom-plus").click(addMin("#pom-minutes"));
  $("#break-plus").click(addMin("#break-minutes"));  
  $("#start-stop").click(checkButtonStatus("pomodoro"));
  $("#reset").click(resetLastSetting);  
}

$(document).ready(main);