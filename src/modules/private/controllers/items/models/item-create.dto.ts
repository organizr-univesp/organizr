import { IsNotEmpty, IsString } from 'class-validator';

export class ItemCreateDto {
    @IsString()
    @IsNotEmpty()
    projectId: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
