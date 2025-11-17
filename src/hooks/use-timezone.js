import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { format, addMinutes } from 'date-fns';
import { useAuth } from "src/hooks/use-auth";

// This will return the combined date and time in the format of YYYY-MM-DD HH:mm:ss
export const getCombinedDateTime = (date, time) => {
  const baseDate = new Date(date);
  
  if (time) {
    // If time is provided, set the time components from the time parameter
    baseDate.setHours(time.getHours());
    baseDate.setMinutes(time.getMinutes());
    baseDate.setSeconds(time.getSeconds());
  }
  
  return format(baseDate, 'yyyy-MM-dd HH:mm:ss');
}

export const convertLocalToUTCTime = (date, timeZoneOffset, formatString = "yyyy-MM-dd HH:mm:ss") => {
  // Get browser timezone offset in hours
  const browserOffset = -new Date().getTimezoneOffset() / 60;

  // First convert to UTC using browser offset
  const sign = browserOffset > 0 ? '-' : '+';
  const absHours = Math.abs(Math.floor(browserOffset));
  const timeZone = `Etc/GMT${sign}${absHours}`;

  // Convert local time to UTC using browser offset
  let utcDate = zonedTimeToUtc(date, timeZone);

  // Handle decimal part of browser offset
  const fractionalBrowser = browserOffset - Math.floor(browserOffset);
  const browserMinutes = Math.round(fractionalBrowser * 60);
  utcDate = browserOffset > 0
    ? addMinutes(utcDate, -browserMinutes)
    : addMinutes(utcDate, browserMinutes);

  // Now apply the timezone offset by subtracting hours
  // This shifts the date back by the timezone offset hours
  const adjustedDate = addMinutes(utcDate, -timeZoneOffset * 60);

  return format(adjustedDate, formatString);
}

export const convertUTCToLocalTime = (utcDate, timeZoneOffset, formatString = "yyyy-MM-dd HH:mm:ss") => {
  // Split offset into hours and minutes
  const wholeHours = Math.trunc(timeZoneOffset);
  const fractionalHours = timeZoneOffset - wholeHours;
  const additionalMinutes = Math.round(fractionalHours * 60);

  // Convert offset to IANA timezone format using whole hours
  const sign = wholeHours > 0 ? '-' : '+';
  const absOffset = Math.abs(wholeHours);
  const timeZone = `Etc/GMT${sign}${absOffset}`;

  // Convert UTC to local time using utcToZonedTime
  let utcDateTime;

  if (utcDate?.endsWith('Z') || utcDate?.endsWith('UTC')) {
    utcDateTime = new Date(utcDate);
  } else {
    utcDateTime = new Date(utcDate + ' UTC');
  }
  
  const localDate = utcToZonedTime(utcDateTime, timeZone);

  // Adjust for additional minutes
  const adjustedDate = timeZoneOffset > 0 
    ? addMinutes(localDate, additionalMinutes)
    : addMinutes(localDate, -additionalMinutes);

  // Format the local date
  return format(adjustedDate, formatString);
}

export const useTimezone = () => {
  const { timezoneOffset: offSet, user } = useAuth();
  const toLocalTime = (value, format) => {
    if (!value) return null;
    return convertUTCToLocalTime(value, offSet, format);
  };

  const toUTCTime = (value, format) => {
    if (!value) return null;
    return convertLocalToUTCTime(value, offSet, format);
  };

  const combineDate = (date, time) => {
    if (!date) return null;
    return getCombinedDateTime(date, time);
  };

  const convertFormat = (date, formatString = "yyyy-MM-dd") => {
    if (!date) return null;
    return format(new Date(date), formatString);
  };

  return { toLocalTime, toUTCTime, combineDate, format: convertFormat, user };
};