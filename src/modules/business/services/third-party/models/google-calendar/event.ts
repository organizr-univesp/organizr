export interface DateWithTimeZone {
    dateTime: string;
    timeZone: string;
}

export interface Event {
    id: string;
    summary: string;
    start: DateWithTimeZone;
    end: DateWithTimeZone;
}
