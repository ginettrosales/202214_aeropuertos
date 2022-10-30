import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineAirportController } from './airline-airport.controller';

@Module({
    providers: [AirlineAirportService],
    imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
    controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
