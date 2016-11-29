const SunCalc = require('suncalc');
const $ = require('jquery');
const milisecondsPerDay = 86400000;
const months = ["Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
              ];

$('#input').on("keyup", () => enterText());

const enterText = () => {
  let place = $('#input').val();
  const info = getLocationCoordinates(place);
  $(".city-name").html(info[0]);
  adjust(info[1]);
};


const dailyDaylight = (lat, long) => {
  const milisecondsDaylight = [];
  const dates = datesOf2016();
  dates.forEach((date)=>{
    milisecondsDaylight.push(daylight(date, lat, long));
  });
  return milisecondsDaylight;
};

const totalLight = (lat, long) => {
  const milisecondsDaylight = dailyDaylight(lat, long);
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
  const milisecondsDaylight = dailyDaylight(lat, long);
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

const showPerc = (e, month) => {
  $('.perc').html(`${month} daylight: ${e.currentTarget.id}% `);
};

const play = () => {
  let arr = monthlyDaylight(40.7,-73.9);
  let average = 0;
  months.forEach((month) => {
    let monthContainer = $('<div></div>');
    monthContainer.addClass('month');
    monthContainer.addClass(month);
    monthContainer.attr('month', month);
    monthContainer.attr("id",Math.floor(arr[month]));
    monthContainer.on("mouseover", (e) => showPerc(e, month));

    let totalContainer = $('<div></div>');
    totalContainer.addClass('total');
    let daylightContainer = $('<div></div>');
    daylightContainer.addClass('daylight');
    let monthName = $("<h3></h3>");
    monthName.append(month);
    daylightContainer.css("height", `${arr[month]}%`);
    totalContainer.append(daylightContainer);
    monthContainer.append(totalContainer);
    monthContainer.append(monthName);
    $('.year').append(monthContainer);
    average += arr[month];
  });
  average = Math.floor(average / 12);
  $('.average').html(`Yearly daylight: ${average}%`);
};

const adjust = (coords) => {
  const daylightPerMonth = monthlyDaylight(Math.floor(coords.lat), Math.floor(coords.lng));
  console.log(daylightPerMonth);
  Object.keys(daylightPerMonth).forEach((month) => {
    $(`.${month}`).attr("id", Math.floor(daylightPerMonth[month]));
    $(`.${month}`).find(".daylight").css("height", `${daylightPerMonth[month]}%`);
  });
};

//AIzaSyAoUOHgYBU1FNoF7t7UzQchPqux_seLEHQ


const getLocationCoordinates = (address) => {
    let position = {};
    let formattedAddress = "";
    $.ajax({
        url : 'http://maps.google.com/maps/api/geocode/json',
        type : 'GET',
        data : {
            address : address,
            sensor : false
        },
        async : false,
        success : function(result) {
            try {
                position.lat = result.results[0].geometry.location.lat;
                position.lng = result.results[0].geometry.location.lng;
                formattedAddress = result.results[0].formatted_address;

            } catch(err) {
                position = null;
            }

        }
    });

    return [formattedAddress, position];
};


play();
