import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';

@Injectable()
export class AirportService {
    constructor(
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ){}

    async findAll(): Promise<AirportEntity[]> {
        return await this.airportRepository.find({ relations: ["airlines"] });
    }

    async findOne(id: number): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({where: {id}, relations: ["airlines"] } );
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
   
        return airport;
    }
    async create(airport: AirportEntity): Promise<AirportEntity> {
        return await this.airportRepository.save(airport);
    }

    async update(id: number, airport: AirportEntity): Promise<AirportEntity> {
        const persistedAirport: AirportEntity = await this.airportRepository.findOne({where:{id}});
        if (!persistedAirport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.airportRepository.save({...persistedAirport, ...airport});
    }

    async delete(id: number) {
        const airport: AirportEntity = await this.airportRepository.findOne({where:{id}});
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.airportRepository.remove(airport);
    }
}
