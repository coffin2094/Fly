import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { mySearchFormatter } from './formatters/flightSearchFormatter';
import { decodeToken } from './miscellaneous/resultTokenEncoder';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class FlightService {

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redisClient: Redis
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
    return response;
  }

  //NOTE: commitBooking
  async commitBooking(payload: any) {
    const commitBookingUrl = this.getUrl('commitBooking');
    const response = await this.runApi(payload, commitBookingUrl)
    return response;
  }

  //NOTE: holdTicket
  async holdTicket(payload: any) {
    const holdTicketUrl = this.getUrl('holdTicket');
    const response = await this.runApi(payload, holdTicketUrl)
    return response;
  }
}
