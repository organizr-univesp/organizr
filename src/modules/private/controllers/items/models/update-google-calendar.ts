import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateGoogleCalendar {
    @IsNotEmpty()
    @IsDateString()
    start: Date;

    @IsNotEmpty()
    @IsDateString()
    end: Date;
}
