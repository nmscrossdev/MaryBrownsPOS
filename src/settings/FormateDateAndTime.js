import moment from 'moment';
import Config from '../Config';
var moment_time_zone = require('moment-timezone');

/**
 * Created By :Shakuntala Jatav
 * Created Date :05-11-2019
 * Description : date formate change according to time zone and date wise. 
 * @param {*} date_time time and date
 * @param {*} time_zone 
 */
function formatDateAndTime(date_time, time_zone) {
    if (time_zone == '+00:00') {
        var DateTime = moment.utc(date_time)
        return DateTime.local().format(Config.key.DATE_FORMAT);
    } else {
      if( !date_time || !time_zone){
        var _date = moment(date_time).format(Config.key.DATETIME_FORMAT);
        var m = moment_time_zone.tz(_date, Config.key.DATETIME_FORMAT, time_zone);
        //m.utc();
        return m.format(Config.key.DATE_FORMAT);
      }
       
        var cutoffString = date_time; // in utc
        var utcCutoff = moment.utc(cutoffString, 'YYYYMMDD HH:mm:ss');
        var displayCutoff = utcCutoff.clone().tz(time_zone);
        return displayCutoff.format(Config.key.DATE_FORMAT);
    }
  }

  /**
* Created By :Shakuntala Jatav
* Created Date :27-07-2019
* Description : date formate change according to time zone and date wise. 
* @param {*} date_time time and date
* @param {*} time_zone  string
*/
function recieptFormatDateAndTime(date_time, time_zone) {
    if (time_zone == '+00:00') {
      var DateTime = moment.utc(date_time)
      return DateTime.local().format(Config.key.DATETIME_FORMAT);
  
    } else {
      if( !date_time || !time_zone){
        var _date = moment(date_time).format(Config.key.DATETIME_FORMAT);
        var m = moment_time_zone.tz(_date, Config.key.DATETIME_FORMAT, time_zone);
        //m.utc();
        return m.format(Config.key.DATETIME_FORMAT);
      }
      if( !date_time || !time_zone) return '';
        var cutoffString = date_time; // in utc
        var utcCutoff = moment.utc(cutoffString, 'YYYYMMDD HH:mm:ss');
        var displayCutoff = utcCutoff.clone().tz(time_zone);
        return displayCutoff.format(Config.key.DATE_FORMAT);
      }
  }

  function formatDateWithTime(date_time, time_zone) {
    if ( ! time_zone) {//if timezone not avilable
      var gmtDateTime = moment.utc(date_time)
      return gmtDateTime.format('LT');
    }
    if (time_zone == '+00:00') {
         var gmtDateTime = moment.utc(date_time)
         return gmtDateTime.local().format('LT');
           } else {
         var _date = moment(date_time).format(Config.key.DATETIME_FORMAT);
         var m = moment_time_zone.tz(_date, Config.key.DATETIME_FORMAT, time_zone);
         //m.utc();
         return m.local().format('LT');
     }
  }
  function dateFormatBySetting(date_time, time_zone,dateformate,timeformate) {
    var _formatedDate="";
    var _timeformate="";
    if (time_zone == '+00:00') {
      var DateTime = moment.utc(date_time)    
      if(dateformate)     
          _formatedDate=DateTime.local().format(dateformate.toUpperCase())
      if(timeformate)
          _timeformate=DateTime.local().format(timeformate)
        //console.log("newformatedDate",dateformate +' '+_timeformate)  
      return _formatedDate +' '+_timeformate;
     //return DateTime.local().format(Config.key.DATETIME_FORMAT);
  
    } else {
      var _date = moment(date_time).format(dateformate.toUpperCase());
      var m = moment_time_zone.tz(_date, timeformate, time_zone);
     // m.utc();
     // retuenDate=m.format(Config.key.DATETIME_FORMAT);
      if(dateformate)     
      _formatedDate=m.format(dateformate.toUpperCase())
       if(timeformate)
      _timeformate=m.format(timeformate)
       // console.log("newformatedDate1",_formatedDate +' '+_timeformate)  
  return _formatedDate +' '+_timeformate;
    }

  
  }

  export const FormateDateAndTime = {
    formatDateAndTime, recieptFormatDateAndTime, formatDateWithTime,dateFormatBySetting
}

export default FormateDateAndTime;