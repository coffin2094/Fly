import { Body, Controller, Post } from '@nestjs/common';
import { FlightService } from './flight.service';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) { }

  //NOTE: flight serach Controller
  @Post('search')
  async searchFlight(@Body() payload: any) {
    if (!payload) return "request body is missing or invalid"
    return await this.flightService.SearchFlight(payload)
  }

  //NOTE: updateFairQuote controller
  @Post('updateFairQuote')
  async updateFairQuote(@Body() payload: any) {
    if (!payload) return "request body is missing or invalid"
    return await this.flightService.updateFairQuote(payload)
  }


  //NOTE: flight serach Controller
  @Post('commitBooking')
  async commitBooking(@Body() payload: any) {
    if (!payload) return "request body is missing or invalid"
    return await this.flightService.commitBooking(payload);
  }
  //NOTE: flight serach Controller
  @Post('holdTicket')
  async holdTicket(@Body() payload: any) {
    if (!payload) return "request body is missing or invalid"
    return await this.flightService.holdTicket(payload);
  }

}
