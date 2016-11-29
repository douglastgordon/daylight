#Daylight

##[Live](http://wireworld.co/)

A graphical display of daylight hours for any city. Built using JavaScript, jQuery, SunCalc and the Google Geocoding API.

##ScreenShot
![daylight]

##Technical details

I used the SunCalc library to retrieve sunrise and sunset data for certain coordinates for each day. At the poles, however, the sun won't rise (or set, depending on the season) for months. For these dates, SunCalc returns an invalid Date object for both sunrise and sunset and finding the time difference between these results in NaN. So, I used the fixDiff method below to fix the miliseconds of daylight if it is NaN. The value will either be set to 0 (Winter at the pole) or a constant milisecondsPerDay, which is the total number of miliseconds in a day (Summer at the pole).

```javascript
const fixDiff = (diff, lat) => {
  let fixedDiff;
  if (lat > 0){
    fixedDiff = milisecondsPerDay;
  } else {
    fixedDiff = 0;
  }
  return fixedDiff;
};
```

###Features
* Geocoding of city-name to coordinates
* live updating
* hoverable graph for more info

[daylight]: ./images/daylight.png
