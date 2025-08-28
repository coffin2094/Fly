import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { mySearchFormatter } from './formatters/flightSearchFormatter';
import { decodeToken } from './miscellaneous/resultTokenEncoder';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from './Entities/passenger.entity';
import { generateAppReference } from './miscellaneous/genAppReference';
import { myFairQuoteFormatter } from './formatters/fairQuoteFormatter';
import { formatCommitBookingResponse } from './formatters/commitBookingFormatter';

@Injectable()
export class FlightService {

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(Passenger) private readonly passengerRepo: Repository<Passenger>
  ) { }

  //NOTE:  Get Headers
  getHeaders() {
    return {
      'x-Username': this.configService.get<string>('USERNAME'),
      'x-Password': this.configService.get<string>('PASSWORD'),
      'x-system': this.configService.get<string>('SYSTEM'),
      'x-DomainKey': this.configService.get<string>('DOMAINKEY'),
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate',

    }
  }

  //NOTE: get URLs
  getUrl(type: 'search' | 'fairQuote' | 'commitBooking' | 'holdTicket'): string {
    const urls = {
      search: this.configService.get<string>('FLIGHTSEARCHURL')!,
      fairQuote: this.configService.get<string>('UPDATEFAIRQUOTEURL')!,
      commitBooking: this.configService.get<string>('COMMITBOOKINGURL')!,
      holdTicket: this.configService.get<string>('HOLDTICKETURL')!,
    };

    return urls[type];
  }


  //NOTE: Generic apiCaller
  async runApi(payload: any, url: string) {
    try {
      const headers = this.getHeaders();
      const response = await firstValueFrom(this.httpService.post(url, payload, { headers }));
      if (!response.data) throw new HttpException("failed fetching the request", HttpStatus.BAD_REQUEST);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        details: error.response?.data || null,
      };
    }

  }



  //NOTE: serachFlight
  async SearchFlight(payload: any) {
    const SearchFlightUrl = this.getUrl('search')
    const response = await this.runApi(payload, SearchFlightUrl)
    return mySearchFormatter(response);
  }


  //NOTE: Fair Quote
  async updateFairQuote(payload: any) {

    //HACK: check redis first
    const tokenKey = payload.ResultToken;
    const cachedResponse = await this.redisClient.get(tokenKey)
    if (cachedResponse) {
      return JSON.parse(cachedResponse)
    }

    //HACK: decoding the token
    const decodedPayload = {
      ResultToken: decodeToken(payload.ResultToken)
    }
    const updateFairQuoteUrl = this.getUrl('fairQuote')
    const response = await this.runApi(decodedPayload, updateFairQuoteUrl)

    //HACK: cache response in redis
    await this.redisClient.set(tokenKey, JSON.stringify(response), 'EX', 300)

    return myFairQuoteFormatter(response)
  }

  //NOTE: commitBooking
  async commitBooking(payload: any) {
    const commitBookingUrl = this.getUrl('commitBooking');
    const appReference = generateAppReference();

    //HACK: save to db
    const passengers = payload.Passengers.map((passenger) => {
      return this.passengerRepo.create({
        AppReference: appReference,
        ...passenger
      })
    })
    await this.passengerRepo.save(passengers)

    //HACK: building payload for api
    const bookingPayload = {
      AppReference: appReference,
      SequenceNumber: payload.SequenceNumber,
      ResultToken: decodeToken(payload.ResultToken),
      Passengers: payload.Passengers,
    }
    const response = await this.runApi(bookingPayload, commitBookingUrl)
    return formatCommitBookingResponse(response);
  }

  //NOTE: holdTicket
  async holdTicket(payload: any) {
    const holdTicketUrl = this.getUrl('holdTicket');
    const response = await this.runApi(payload, holdTicketUrl)
    return response;
  }
}
