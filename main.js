const SunCalc = require('suncalc');
const milisecondsPerDay = 86400000;


const yearDaylight = (lat, long) => {

};

const daylight = (date, lat, long) => {
  const currentDate = Date.now();
  const times = SunCalc.getTimes(currentDate, lat, long);
  const sunset = times.sunset;
  const sunrise = times.sunrise;
  const diff = sunset - sunrise;
  return diff;
};


const last365 = () => {

};
daylight(51.5, -0.1);
