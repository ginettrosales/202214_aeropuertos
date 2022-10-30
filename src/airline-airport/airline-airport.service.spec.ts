import { Test, TestingModule } from '@nestjs/testing';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList : AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    airlineRepository.clear();
    airportRepository.clear();

    airportsList = [];
    for(let i = 0; i < 5; i++){
      const airport: AirportEntity = await airportRepository.save({
        name: faker.lorem.word(2), 
        code: faker.database.engine(), 
        country: faker.address.country(), 
        city: faker.address.city()
      })
      airportsList.push(airport);
    }

    airline = await airlineRepository.save({
      name: faker.lorem.word(2), 
      description: faker.lorem.sentence(), 
      foundation: faker.date.birthdate({min: 2, max:300}), 
      website: faker.internet.domainName(),
      airports: airportsList
    })
  }    

  it('servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline agrega un aeropuerto a una aerolinea', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(2), 
      code: faker.database.engine(), 
      country: faker.address.country(), 
      city: faker.address.city()
    });
 
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.lorem.word(2), 
      description: faker.lorem.sentence(), 
      foundation: faker.date.birthdate({min: 2, max:300}), 
      website: faker.internet.domainName()
    })
 
    const result: AirlineEntity = await service.addAirportToAirline(newAirline.id, newAirport.id);
   
    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name)
    expect(result.airports[0].code).toBe(newAirport.code)
    expect(result.airports[0].country).toBe(newAirport.country)
    expect(result.airports[0].city).toBe(newAirport.city)
  });

  it('addAirportToAirline devuelve execepcion por aeropuerto invalido', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.lorem.word(2), 
      description: faker.lorem.sentence(), 
      foundation: faker.lorem.text(), 
      website: faker.internet.domainName()
    })
 
    await expect(() => service.addAirportToAirline(newAirline.id, 0)).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('addAirportToAirline devuelve execepcion por aerolinea invalida', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(2), 
      code: faker.database.engine(), 
      country: faker.address.country(), 
      city: faker.address.city()
    });
 
    await expect(() => service.addAirportToAirline(0, newAirport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportsFromAirline devuelve los aeropuertos de una aerolinea', async ()=>{
    const airports: AirportEntity[] = await service.findAirportsFromAirline(airline.id);
    expect(airports.length).toBe(5)
  });

  it('findAirportsFromAirline devuelve execepcion por aerolinea invalida', async () => {
    await expect(()=> service.findAirportsFromAirline(0)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });
  
  it('findAirportFromAirline debe retornar un aeropuero por aerolinea', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedAirport: AirportEntity = await service.findAirportFromAirline(airline.id, airport.id,)
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toBe(airport.name);
    expect(storedAirport.code).toBe(airport.code);
    expect(storedAirport.country).toBe(airport.country);
    expect(storedAirport.city).toBe(airport.city);
  });

  it('findAirportFromAirline devuelve execepcion por aeropuerto invalido', async () => {
    await expect(()=> service.findAirportFromAirline(airline.id, 0)).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('findAirportFromAirline devuelve execepcion por aerolinea invalida', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(()=> service.findAirportFromAirline(0, airport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportFromAirline devuelve execepcion por un aeropuerto que no esta asociado a una aerolinea', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.lorem.word(2), 
      code: faker.database.engine(), 
      country: faker.address.country(), 
      city: faker.address.city()
    });
 
    await expect(()=> service.findAirportFromAirline(airline.id, newAirport.id)).rejects.toHaveProperty("message", "The airport with the specified id is not associated to this airline");
  });

});
