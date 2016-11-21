const SunCalc = require('suncalc');
const milisecondsPerDay = 86400000;


const yearDaylight = (lat, long) => {
  const milisecondsDaylight = [];
  const dates = datesOf2016();
  dates.forEach((date)=>{
    milisecondsDaylight.push(daylight(date, lat, long));
  });
  return milisecondsDaylight;
};

const daylight = (date, lat, long) => {
  const times = SunCalc.getTimes(date, lat, long);
  const sunset = times.sunset;
  const sunrise = times.sunrise;
  const diff = sunset - sunrise;
  return diff;
};


const datesOf2016 = () => {
  let dates = [];
  const monthsWith30Days = [4, 6, 9, 10];
  for (let month = 0; month < 12; month++){
    for (let day = 1; day <= 31; day++){

      if (day === 30 && month == 2){
        break;
      } else if (day === 31 && monthsWith30Days.includes(month)){
        break;
      } else {
        let newDate = new Date(2016, month, day);
        dates.push(newDate);
      }
    }
  }
  return dates;
};

let test = yearDaylight(51.5, -0.1);
console.log(test);
