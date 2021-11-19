import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class ProjectCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsHexColor()
    @IsNotEmpty()
    color: string;
}
