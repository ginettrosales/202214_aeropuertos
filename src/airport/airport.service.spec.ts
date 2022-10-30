import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for(let i = 0; i < 5; i++){
        const airport: AirportEntity = await repository.save({
        name: faker.lorem.word(2), 
        code: faker.database.engine(), 
        country: faker.address.country(), 
        city: faker.address.city()})
        airportsList.push(airport);
    }
  }

  it('servicio debe estar creado', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los aeropuertos', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne debe retornar una aeropuerto por id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name)
    expect(airport.code).toEqual(storedAirport.code)
    expect(airport.country).toEqual(storedAirport.country)
    expect(airport.city).toEqual(storedAirport.city)
  });

  it('findOne devuelve una execepcion por aeropuerto invalido', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('create retorna un nuevo aeropuerto', async () => {
    const airport: AirportEntity = {
      id: 1,
      name: faker.lorem.word(2), 
      code: faker.database.engine(), 
      country: faker.address.country(), 
      city: faker.address.city(),
      airlines: []
    }

    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({where: {id: newAirport.id}})
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(newAirport.name)
    expect(storedAirport.code).toEqual(newAirport.code)
    expect(storedAirport.country).toEqual(newAirport.country)
    expect(storedAirport.city).toEqual(newAirport.city)
  });

  it('update actualiza un aeropuerto', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = "Nuevo nombre";
    airport.country = "Nuevo pais";
  
    const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();
  
    const storedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name)
    expect(storedAirport.country).toEqual(airport.country)
  });
 
  it('update devuelve una execepcion por aeropuerto invalido', async () => {
    let airport: AirportEntity = airportsList[0];
    airport = {
      ...airport, name: "Nuevo nombre", country: "Nuevo pais"
    }
    await expect(() => service.update(0, airport)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('delete elimina un aeropuerto', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
  
    const deletedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(deletedAirport).toBeNull();
  });

  it('delete devuelve una execepcion por aeropuerto invalido', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
});
