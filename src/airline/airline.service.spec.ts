import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for(let i = 0; i < 5; i++){
        const airline: AirlineEntity = await repository.save({
        name: faker.lorem.word(2), 
        description: faker.lorem.sentence(), 
        foundation: faker.date.birthdate({min: 2, max:300}), 
        website: faker.internet.domainName()})
        airlinesList.push(airline);
    }
  }

  it('servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las aerolineas', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne debe retornar una aerolinea por id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name)
    expect(airline.description).toEqual(storedAirline.description)
    expect(airline.foundation).toEqual(storedAirline.foundation)
    expect(airline.website).toEqual(storedAirline.website)
  });

  it('findOne devuelve una execepcion por aerolinea invalida', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('create retorna una nueva aerolinea', async () => {
    const airline: AirlineEntity = {
      id: 1,
      name: faker.lorem.word(2), 
      description: faker.lorem.sentence(), 
      foundation: faker.date.birthdate({min: 2, max:300}), 
      website: faker.internet.domainName(),
      airports: []
    }
 
    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();
 
    const storedAirline: AirlineEntity = await repository.findOne({where: {id: newAirline.id}})
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(newAirline.name)
    expect(storedAirline.description).toEqual(newAirline.description)
    expect(storedAirline.foundation).toEqual(newAirline.foundation)
    expect(storedAirline.website).toEqual(newAirline.website)
  });

  it('update modifica una aerolinea', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = "Prueba actualizar name";
    airline.description = "Prueba actualizar description";
    const updateAirline: AirlineEntity = await service.update(airline.id, airline);
    expect(updateAirline).not.toBeNull();
    const storedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name)
    expect(storedAirline.description).toEqual(airline.description)
  });

  it('update retorna una excepcion por una aerolinea invalida', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline, name: "Nuevo nombre", description: "Nueva descripcion"
    }
    await expect(() => service.update(0, airline)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('delete debe eliminar una aerolinea', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
     const deletedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(deletedAirline).toBeNull();
  });

  it('delete retorna una excepcion por una aerolinea invalida', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });
});
