export interface DateWithTimeZone {
    dateTime: string;
    timeZone: string;
}

export interface Event {
    summary: string;
    start: DateWithTimeZone;
    end: DateWithTimeZone;
}
