const moment = require('moment');

const SECONDS_IN_A_DAY = 86400;

const getCurrentMidnight = (m=moment()) => (
  m.hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
);

const getNextMidnight = (m=getCurrentMidnight().clone()) => (
  m.clone().add(1, 'd')
);

// const getPreviousMidnight = (m=getCurrentMidnight().clone()) => (
//   m.clone().subtract(1, 'd')
// );

// const _getBoundingTimestamps = (m) => {
//   const midnight = getCurrentMidnight(m);
//   return [
//     midnight,
//     getNextMidnight(midnight)
//   ].map((t) => t.unix());
// };

/*

UNIX time returns seconds, not milliseconds
so, those aren't bounding correctly, since the timestamps
i'm using are milliseconds

*/

const _convertToMillisecondString = (tsInt) => (
  [tsInt + '', '000'].join('')
);

const getBoundingTimestamps = (howMany=1) => {
  let tsArray = [];
  let zeroOclock = getNextMidnight().unix();
  for (let i=0; i<howMany; i++) {
    tsArray.push([zeroOclock - SECONDS_IN_A_DAY, zeroOclock].map(_convertToMillisecondString));
    zeroOclock = zeroOclock - SECONDS_IN_A_DAY;
  }
  return tsArray;
}



module.exports = {
  // getCurrentMidnight,
  // getNextMidnight,
  getBoundingTimestamps,
  // arrayOfTimestamps,
}