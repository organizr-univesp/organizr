import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { format } from 'date-fns';

export class DateTime {
    date: Date;
    // This date is local in the format: YYYY-MM-DDThh:MM[:ss[.sss]] (the missing Z at the end is the main change)
    dateTimeLocal: string;
    timeZone: string;

    constructor(date: Date, timeZone: string) {
        this.date = date;
        // Remove the last-character ("Z", in this case) to match the requirements
        // for using a datetime-local input.
        this.dateTimeLocal = format(this.date, "yyyy-MM-dd'T'HH:mm:ss.SSS");
        this.timeZone = timeZone;
    }

    static fromUtcToZoned(
        date: string | number | Date,
        timeZone: string,
    ): DateTime {
        const dateInstance = utcToZonedTime(date, timeZone);
        return new DateTime(dateInstance, timeZone);
    }

    static fromZonedToUtc(
        date: string | number | Date,
        timeZone: string,
    ): DateTime {
        const dateInstance = zonedTimeToUtc(date, timeZone);
        return new DateTime(dateInstance, timeZone);
    }
}
