import { AirportEntity } from "../airport/airport.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AirlineEntity {
    @PrimaryGeneratedColumn()
    id: number;
 
    @Column()
    name: string;
 
    @Column()
    description: string;
 
    @Column()
    foundation: Date;
 
    @Column()
    website: string;

    @ManyToMany(() => AirportEntity, airport => airport.airlines)
    @JoinTable()
    airports: AirportEntity[];
}
