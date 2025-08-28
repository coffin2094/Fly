import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Passengers')
export class Passenger {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  AppReference: string;

  @Column()
  Title: string;

  @Column()
  FirstName: string;

  @Column()
  LastName: string;

  @Column()
  PaxType: string;

  @Column()
  Gender: string;

  @Column({ nullable: true })
  DateOfBirth?: string;

  @Column({ nullable: true })
  PassportNumber?: string;

  @Column({ nullable: true })
  PassportExpiry?: string;

  @Column()
  CountryCode: string;

  @Column()
  CountryName: string;

  @Column({ type: 'varchar', length: 15 })
  ContactNo: string;

  @Column()
  City: string;

  @Column()
  PinCode: number;

  @Column()
  AddressLine1: string;

  @Column({ nullable: true })
  AddressLine2?: string;

  @Column()
  Email: string;

  @Column({ nullable: true })
  BaggageId?: string;

  @Column({ nullable: true })
  MealId?: string;

  @Column({ nullable: true })
  SeatId?: string;
}
