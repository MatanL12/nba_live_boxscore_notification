const MIN_IN_QUARTER = 12;

const ComparisionResults = Object.freeze({
  Less: Symbol("less"),
  Equal: Symbol("equal"),
  Greater: Symbol("greater")
})

function convertGameStatusTextToGameClock(gameStatusText) {
  try {
      if(gameStatusText !== 'Final') {
          const period = parseInt(gameStatusText[1]);
          const minutes = parseInt(gameStatusText.slice(-5,-3), 10);
          const seconds = parseInt(gameStatusText.slice(-2), 10);
          const gameClock = convertToGameTime(period, minutes, seconds);
          return gameClock;
      }
      else {
        return 0;
      }
  }
  catch (err) {
      console.log("invalid game status text" + err.message);
  }
}

function compareTwoGameClocks (firstGameClock, secondGameClock) {
  if(firstGameClock < secondGameClock) {
    return ComparisionResults.Less;
  }
  else if(firstGameClock > secondGameClock) {
    return ComparisionResults.Greater;
  }
  return ComparisionResults.Equal;
}

function isGameClockPassed (alertGameClock, gameClock) {
  if(compareTwoGameClocks(alertGameClock, gameClock) !== ComparisionResults.Greater) {
    return true;
  }
  return false;
}


function convertToGameTime (period, minutes, seconds) {
  return MIN_IN_QUARTER * (period-1) + minutes + seconds/100;
}

module.exports = {
  convertToGameTime,
  convertGameStatusTextToGameClock,
  compareTwoGameClocks,
  isGameClockPassed,
  ComparisionResults
}

