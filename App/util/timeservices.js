import { Util } from 'expo'

/**
 *
 * @param {Date} date
 *  Date object, representing the DateTime in UTC
 */
export function getDateString(date) {
    if (date.getTime() === new Date(null).getTime()) return '';


    let onlyYear = date.getFullYear();
    let onlyDay = date.getDate();
    let onlyMonth = date.getMonth() + 1;

    let reference = date.toLocaleDateString();

    if (reference.includes('-') ||
       (reference.split(/\//g)[0] === ('0' + onlyDay).slice(-2) &&
        reference.split(/\//g)[1] === ('0' + onlyMonth).slice(-2))) { // Swedish style!
        return `${('0' + onlyDay).slice(-2)}/${('0' + onlyMonth).slice(-2)}/${onlyYear}`;
    }
    return `${('0' + onlyMonth).slice(-2)}/${('0' + onlyDay).slice(-2)}/${onlyYear}`;
}

/**
 *
 * @param {Date} date
 *  Date object, representing the DateTime in UTC
 */
export function getTimeString(date) {
    if (date.getTime() === new Date(null).getTime()) {
        return 'N/A';
    }

    let timeStringSplit = date.toLocaleTimeString().split(/:/g);
    let maybeAMPM = timeStringSplit[2].split(/ /g)[1];

    return `${timeStringSplit[0].length === 1 ? '0' : ''
            }${timeStringSplit[0]
            }:${timeStringSplit[1]
            } ${!!maybeAMPM ? maybeAMPM : ''}`
}

/**
 *
 * @param {Date} date
 *  Date object, representing the DateTime in UTC
 */
export function getDateTimeString(date) {
    let onlyHour = date.getHours();
    let onlyMin = date.getMinutes();

    return `${getDateString(date)} ${getTimeString(date)}`;
}

/** Gets a string that says how many seconds, minutes or hours ago
 *  a date was
 *
 * @param {Date} time
 *  A time in the past, to compare with the time now
 */
export function getTimeDifferenceString(time) {
    return getTimeDifferenceTwoString(time, new Date)
}
/* Get the time between two different timestamps */
export function getTimeDifferenceTwoString(time, time2) {


  //Make it seconds
    let rawSeconds = (time2 - time)/1000;
    let timeDif = Math.abs(rawSeconds);

    //Handle negative
    let negative = "";
    if(rawSeconds <= -60)
        negative = "-";

    // Minutes
    timeDif = timeDif / 60;
    if (timeDif < 60) {
        return `${negative + Math.floor(timeDif)} min`;
    }

    //With less than 3 hours, display hours + minutes
    if(timeDif < 3*60) {
        let mins  = timeDif%60;
        let hours = (timeDif-mins)/60;
        return `${negative + hours}h ${Math.floor(mins)}m`;
    }
    //Between 4 and 96 hours, display only hours
    if(timeDif < 96*60) {
        return `${negative + Math.floor(timeDif/60)}h`;
    }

    timeDif = timeDif / 60;
    //At 96 hours or more, display days + hours
    let hours = timeDif%24;
    let days = (timeDif-hours)/24;
    return `${negative + days}d ${Math.floor(hours)}h`;
    }
