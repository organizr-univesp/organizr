import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEvent {
    @IsNotEmpty()
    @IsString()
    timeZone: string;

    @IsNotEmpty()
    @IsDateString()
    start: Date;

    @IsNotEmpty()
    @IsDateString()
    end: Date;
}
