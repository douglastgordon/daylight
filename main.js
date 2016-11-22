const SunCalc = require('suncalc');
const milisecondsPerDay = 86400000;
const months = ["January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
              ];

const yearDaylight = (lat, long) => {
  const milisecondsDaylight = [];
  const dates = datesOf2016();
  dates.forEach((date)=>{
    milisecondsDaylight.push(daylight(date, lat, long));
  });
  return milisecondsDaylight;
};

const totalLight = (lat, long) => {
  const milisecondsDaylight = yearDaylight(lat, long);
  let total = 0;
  milisecondsDaylight.forEach((month) => {
    total += month;
  });
  const seconds = total/1000;
  const minutes = seconds/60;
  const hours = minutes/60;
  return hours;
};

const monthlyDaylight = (lat, long) => {
  const milisecondsDaylight = yearDaylight(lat, long);
  let percentageDaylight = {};
  let count = 0;
  months.forEach((month)=>{

    let monthLength;
    if (month === "February"){
      monthLength = 29;
    } else if (["April", "June", "September", "November"].includes(month)){
      monthLength = 30;
    } else {
      monthLength = 31;
    }

    let total = monthLength * milisecondsPerDay;
    let arrSlice = milisecondsDaylight.slice(count, count + monthLength);
    let totalDaylight = arrSlice.reduce((a, b) => a + b, 0);
    let perc = (totalDaylight/total)*100;
    percentageDaylight[month] = perc;
    count += monthLength;
  });

  return percentageDaylight;
};




const daylight = (date, lat, long) => {
  const times = SunCalc.getTimes(date, lat, long);
  const sunset = times.sunset;
  const sunrise = times.sunrise;
  let diff = sunset - sunrise;
  if (isNaN(diff)){
    diff = fixDiff(diff, lat);
  }
  return diff;
};

//fixes diff when sun doesn't rise or set
const fixDiff = (diff, lat) => {
  let fixedDiff;
  if (lat > 0){
    fixedDiff = milisecondsPerDay;
  } else {
    fixedDiff = 0;
  }
  return fixedDiff;
};

const datesOf2016 = () => {
  let dates = [];
  const monthsWith30Days = [4, 6, 9, 10];
  for (let month = 0; month < 12; month++){
    for (let day = 1; day <= 31; day++){

      if (day === 30 && month === 2){
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


let test = totalLight(-70, -0.1);
console.log(test);
