/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var SunCalc = __webpack_require__(1);
	var milisecondsPerDay = 86400000;
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	var yearDaylight = function yearDaylight(lat, long) {
	  var milisecondsDaylight = [];
	  var dates = datesOf2016();
	  dates.forEach(function (date) {
	    milisecondsDaylight.push(daylight(date, lat, long));
	  });
	  return milisecondsDaylight;
	};
	
	var monthlyDaylight = function monthlyDaylight(lat, long) {
	  var milisecondsDaylight = yearDaylight(lat, long);
	  var percentageDaylight = {};
	  var count = 0;
	  months.forEach(function (month) {
	
	    var monthLength = void 0;
	    if (month === "February") {
	      monthLength = 29;
	    } else if (["April", "June", "September", "November"].includes(month)) {
	      monthLength = 30;
	    } else {
	      monthLength = 31;
	    }
	
	    var total = monthLength * milisecondsPerDay;
	    var arrSlice = milisecondsDaylight.slice(count, count + monthLength);
	    var totalDaylight = arrSlice.reduce(function (a, b) {
	      return a + b;
	    }, 0);
	    var perc = totalDaylight / total * 100;
	    percentageDaylight[month] = perc;
	    count += monthLength;
	  });
	
	  return percentageDaylight;
	};
	
	var daylight = function daylight(date, lat, long) {
	  var times = SunCalc.getTimes(date, lat, long);
	  var sunset = times.sunset;
	  var sunrise = times.sunrise;
	  var diff = sunset - sunrise;
	  if (isNaN(diff)) {
	    diff = fixDiff(diff, lat);
	  }
	  return diff;
	};
	
	//fixes diff when sun doesn't rise or set
	var fixDiff = function fixDiff(diff, lat) {
	  var fixedDiff = void 0;
	  if (lat > 0) {
	    fixedDiff = milisecondsPerDay;
	  } else {
	    fixedDiff = 0;
	  }
	  return fixedDiff;
	};
	
	var datesOf2016 = function datesOf2016() {
	  var dates = [];
	  var monthsWith30Days = [4, 6, 9, 10];
	  for (var month = 0; month < 12; month++) {
	    for (var day = 1; day <= 31; day++) {
	
	      if (day === 30 && month === 2) {
	        break;
	      } else if (day === 31 && monthsWith30Days.includes(month)) {
	        break;
	      } else {
	        var newDate = new Date(2016, month, day);
	        dates.push(newDate);
	      }
	    }
	  }
	  return dates;
	};
	
	var test = monthlyDaylight(-70, -0.1);
	console.log(test);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 (c) 2011-2015, Vladimir Agafonkin
	 SunCalc is a JavaScript library for calculating sun/moon position and light phases.
	 https://github.com/mourner/suncalc
	*/
	
	(function () { 'use strict';
	
	// shortcuts for easier to read formulas
	
	var PI   = Math.PI,
	    sin  = Math.sin,
	    cos  = Math.cos,
	    tan  = Math.tan,
	    asin = Math.asin,
	    atan = Math.atan2,
	    acos = Math.acos,
	    rad  = PI / 180;
	
	// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas
	
	
	// date/time constants and conversions
	
	var dayMs = 1000 * 60 * 60 * 24,
	    J1970 = 2440588,
	    J2000 = 2451545;
	
	function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
	function fromJulian(j)  { return new Date((j + 0.5 - J1970) * dayMs); }
	function toDays(date)   { return toJulian(date) - J2000; }
	
	
	// general calculations for position
	
	var e = rad * 23.4397; // obliquity of the Earth
	
	function rightAscension(l, b) { return atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l)); }
	function declination(l, b)    { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }
	
	function azimuth(H, phi, dec)  { return atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi)); }
	function altitude(H, phi, dec) { return asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H)); }
	
	function siderealTime(d, lw) { return rad * (280.16 + 360.9856235 * d) - lw; }
	
	
	// general sun calculations
	
	function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
	
	function eclipticLongitude(M) {
	
	    var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
	        P = rad * 102.9372; // perihelion of the Earth
	
	    return M + C + P + PI;
	}
	
	function sunCoords(d) {
	
	    var M = solarMeanAnomaly(d),
	        L = eclipticLongitude(M);
	
	    return {
	        dec: declination(L, 0),
	        ra: rightAscension(L, 0)
	    };
	}
	
	
	var SunCalc = {};
	
	
	// calculates sun position for a given date and latitude/longitude
	
	SunCalc.getPosition = function (date, lat, lng) {
	
	    var lw  = rad * -lng,
	        phi = rad * lat,
	        d   = toDays(date),
	
	        c  = sunCoords(d),
	        H  = siderealTime(d, lw) - c.ra;
	
	    return {
	        azimuth: azimuth(H, phi, c.dec),
	        altitude: altitude(H, phi, c.dec)
	    };
	};
	
	
	// sun times configuration (angle, morning name, evening name)
	
	var times = SunCalc.times = [
	    [-0.833, 'sunrise',       'sunset'      ],
	    [  -0.3, 'sunriseEnd',    'sunsetStart' ],
	    [    -6, 'dawn',          'dusk'        ],
	    [   -12, 'nauticalDawn',  'nauticalDusk'],
	    [   -18, 'nightEnd',      'night'       ],
	    [     6, 'goldenHourEnd', 'goldenHour'  ]
	];
	
	// adds a custom time to the times config
	
	SunCalc.addTime = function (angle, riseName, setName) {
	    times.push([angle, riseName, setName]);
	};
	
	
	// calculations for sun times
	
	var J0 = 0.0009;
	
	function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }
	
	function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
	function solarTransitJ(ds, M, L)  { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }
	
	function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }
	
	// returns set time for the given sun altitude
	function getSetJ(h, lw, phi, dec, n, M, L) {
	
	    var w = hourAngle(h, phi, dec),
	        a = approxTransit(w, lw, n);
	    return solarTransitJ(a, M, L);
	}
	
	
	// calculates sun times for a given date and latitude/longitude
	
	SunCalc.getTimes = function (date, lat, lng) {
	
	    var lw = rad * -lng,
	        phi = rad * lat,
	
	        d = toDays(date),
	        n = julianCycle(d, lw),
	        ds = approxTransit(0, lw, n),
	
	        M = solarMeanAnomaly(ds),
	        L = eclipticLongitude(M),
	        dec = declination(L, 0),
	
	        Jnoon = solarTransitJ(ds, M, L),
	
	        i, len, time, Jset, Jrise;
	
	
	    var result = {
	        solarNoon: fromJulian(Jnoon),
	        nadir: fromJulian(Jnoon - 0.5)
	    };
	
	    for (i = 0, len = times.length; i < len; i += 1) {
	        time = times[i];
	
	        Jset = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
	        Jrise = Jnoon - (Jset - Jnoon);
	
	        result[time[1]] = fromJulian(Jrise);
	        result[time[2]] = fromJulian(Jset);
	    }
	
	    return result;
	};
	
	
	// moon calculations, based on http://aa.quae.nl/en/reken/hemelpositie.html formulas
	
	function moonCoords(d) { // geocentric ecliptic coordinates of the moon
	
	    var L = rad * (218.316 + 13.176396 * d), // ecliptic longitude
	        M = rad * (134.963 + 13.064993 * d), // mean anomaly
	        F = rad * (93.272 + 13.229350 * d),  // mean distance
	
	        l  = L + rad * 6.289 * sin(M), // longitude
	        b  = rad * 5.128 * sin(F),     // latitude
	        dt = 385001 - 20905 * cos(M);  // distance to the moon in km
	
	    return {
	        ra: rightAscension(l, b),
	        dec: declination(l, b),
	        dist: dt
	    };
	}
	
	SunCalc.getMoonPosition = function (date, lat, lng) {
	
	    var lw  = rad * -lng,
	        phi = rad * lat,
	        d   = toDays(date),
	
	        c = moonCoords(d),
	        H = siderealTime(d, lw) - c.ra,
	        h = altitude(H, phi, c.dec);
	
	    // altitude correction for refraction
	    h = h + rad * 0.017 / tan(h + rad * 10.26 / (h + rad * 5.10));
	
	    return {
	        azimuth: azimuth(H, phi, c.dec),
	        altitude: h,
	        distance: c.dist
	    };
	};
	
	
	// calculations for illumination parameters of the moon,
	// based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
	// Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
	
	SunCalc.getMoonIllumination = function (date) {
	
	    var d = toDays(date),
	        s = sunCoords(d),
	        m = moonCoords(d),
	
	        sdist = 149598000, // distance from Earth to Sun in km
	
	        phi = acos(sin(s.dec) * sin(m.dec) + cos(s.dec) * cos(m.dec) * cos(s.ra - m.ra)),
	        inc = atan(sdist * sin(phi), m.dist - sdist * cos(phi)),
	        angle = atan(cos(s.dec) * sin(s.ra - m.ra), sin(s.dec) * cos(m.dec) -
	                cos(s.dec) * sin(m.dec) * cos(s.ra - m.ra));
	
	    return {
	        fraction: (1 + cos(inc)) / 2,
	        phase: 0.5 + 0.5 * inc * (angle < 0 ? -1 : 1) / Math.PI,
	        angle: angle
	    };
	};
	
	
	function hoursLater(date, h) {
	    return new Date(date.valueOf() + h * dayMs / 24);
	}
	
	// calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article
	
	SunCalc.getMoonTimes = function (date, lat, lng, inUTC) {
	    var t = new Date(date);
	    if (inUTC) t.setUTCHours(0, 0, 0, 0);
	    else t.setHours(0, 0, 0, 0);
	
	    var hc = 0.133 * rad,
	        h0 = SunCalc.getMoonPosition(t, lat, lng).altitude - hc,
	        h1, h2, rise, set, a, b, xe, ye, d, roots, x1, x2, dx;
	
	    // go in 2-hour chunks, each time seeing if a 3-point quadratic curve crosses zero (which means rise or set)
	    for (var i = 1; i <= 24; i += 2) {
	        h1 = SunCalc.getMoonPosition(hoursLater(t, i), lat, lng).altitude - hc;
	        h2 = SunCalc.getMoonPosition(hoursLater(t, i + 1), lat, lng).altitude - hc;
	
	        a = (h0 + h2) / 2 - h1;
	        b = (h2 - h0) / 2;
	        xe = -b / (2 * a);
	        ye = (a * xe + b) * xe + h1;
	        d = b * b - 4 * a * h1;
	        roots = 0;
	
	        if (d >= 0) {
	            dx = Math.sqrt(d) / (Math.abs(a) * 2);
	            x1 = xe - dx;
	            x2 = xe + dx;
	            if (Math.abs(x1) <= 1) roots++;
	            if (Math.abs(x2) <= 1) roots++;
	            if (x1 < -1) x1 = x2;
	        }
	
	        if (roots === 1) {
	            if (h0 < 0) rise = i + x1;
	            else set = i + x1;
	
	        } else if (roots === 2) {
	            rise = i + (ye < 0 ? x2 : x1);
	            set = i + (ye < 0 ? x1 : x2);
	        }
	
	        if (rise && set) break;
	
	        h0 = h2;
	    }
	
	    var result = {};
	
	    if (rise) result.rise = hoursLater(t, rise);
	    if (set) result.set = hoursLater(t, set);
	
	    if (!rise && !set) result[ye > 0 ? 'alwaysUp' : 'alwaysDown'] = true;
	
	    return result;
	};
	
	
	// export as AMD module / Node module / browser variable
	if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (SunCalc), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	else if (typeof module !== 'undefined') module.exports = SunCalc;
	else window.SunCalc = SunCalc;
	
	}());


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map