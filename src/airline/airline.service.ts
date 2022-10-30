import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';

@Injectable()
export class AirlineService {
    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>
    ){}

    async findAll(): Promise<AirlineEntity[]> {
        return await this.airlineRepository.find({ relations: ["airports"] });
    }

    async findOne(id: number): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where: {id}, relations: ["airports"] } );
        if (!airline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
   
        return airline;
    }
    async create(airline: AirlineEntity): Promise<AirlineEntity> {
        const date = new Date()
        let f = new Date(airline.foundation)
        if (f >= date){
            throw new BusinessLogicException("The foundation date must be less than today", BusinessError.PRECONDITION_FAILED);
        }
        return await this.airlineRepository.save(airline);
    }

    async update(id: number, airline: AirlineEntity): Promise<AirlineEntity> {
        const persistedAirline: AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        const date = new Date()
        let f = new Date(airline.foundation)
        if (f >= date){
            throw new BusinessLogicException("The foundation date must be less than today", BusinessError.PRECONDITION_FAILED);
        }
        if (!persistedAirline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.airlineRepository.save({...persistedAirline, ...airline});
    }

    async delete(id: number) {
        const airline: AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        if (!airline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.airlineRepository.remove(airline);
    }    
}
