import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightModule } from './flight/flight.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './flight/Entities/passenger.entity';


@Module({
  imports: [FlightModule,

    //NOTE: env setup
    ConfigModule.forRoot({ isGlobal: true }),

    //NOTE: typeorm setup
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: "",
        database: configService.get('DB_NAME'),
        entities: [Passenger],
        synchronize: true, // only for dev, auto-create tables
        logging: true,
      })
    }),

    //NOTE: redis setup
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
      })
    })

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
