import {IsNotEmpty, IsString, Length, MaxLength, MinLength} from 'class-validator';

export class AirportDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    readonly code: string;
    
    @IsString()
    @IsNotEmpty()
    readonly country: string;
    
    @IsString()
    @IsNotEmpty()
    readonly city: string;
}
