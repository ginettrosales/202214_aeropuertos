import {IsDate, IsDateString, IsNotEmpty, IsString, IsUrl, MaxDate, MinDate} from 'class-validator';

export class AirlineDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
    
    @IsDateString()
    @IsNotEmpty()
    //@MaxDate()
    readonly foundation: Date;
    
    @IsUrl()
    @IsNotEmpty()
    readonly website: string;
}
