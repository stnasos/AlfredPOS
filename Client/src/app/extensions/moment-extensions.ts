import * as moment from 'moment';

declare module 'moment' {
  export interface Moment {
    convertToUtc(): moment.Moment;
    convertToLocale(): moment.Moment;
  }
}

moment.fn.convertToUtc = function(this) {
  return this.add(this.utcOffset(), 'm').utc();
}

moment.fn.convertToLocale = function(this) {
  //TODO: Implement convert to locale
  return this;
}