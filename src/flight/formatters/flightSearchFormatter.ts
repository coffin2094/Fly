//NOTE: token encoder and Decoder
import { encodeToken } from "../miscellaneous/resultTokenEncoder";



// helpers for clarity
function mapLeg(leg: any) {
  return {
    Origin: {
      AirportCode: leg.Origin?.AirportCode,
      CityName: leg.Origin?.CityName,
      AirportName: leg.Origin?.AirportName,
      DateTime: leg.Origin?.DateTime,
      Terminal: leg.Origin?.Terminal,
      FDTV: leg.Origin?.FDTV,
    },
    Destination: {
      AirportCode: leg.Destination?.AirportCode,
      CityName: leg.Destination?.CityName,
      AirportName: leg.Destination?.AirportName,
      DateTime: leg.Destination?.DateTime,
      Terminal: leg.Destination?.Terminal,
      FATV: leg.Destination?.FATV,
    },
    OperatorCode: leg.OperatorCode,
    DisplayOperatorCode: leg.DisplayOperatorCode,
    ValidatingAirline: leg.ValidatingAirline,
    OperatorName: leg.OperatorName,
    FlightNumber: leg.FlightNumber,
    CabinClass: leg.CabinClass,
    Operatedbyairline: leg.Operatedbyairline,
    Operatedbyairlinename: leg.Operatedbyairlinename,
    Duration: leg.Duration,
    Attr: {
      Baggage: leg.Attr?.Baggage,
      CabinBaggage: leg.Attr?.CabinBaggage,
      AvailableSeats: leg.Attr?.AvailableSeats,
    },
    stop_over: leg.stop_over,
  };
}

function mapPrice(price: any) {
  return {
    Currency: price?.Currency,
    TotalDisplayFare: price?.TotalDisplayFare,
    PriceBreakup: {
      BasicFare: price?.PriceBreakup?.BasicFare,
      Tax: price?.PriceBreakup?.Tax,
      AgentCommission: price?.PriceBreakup?.AgentCommission,
      AgentTdsOnCommision: price?.PriceBreakup?.AgentTdsOnCommision,
    },
  };
}

function mapAttr(attr: any) {
  return {
    IsRefundable: attr?.IsRefundable,
    AirlineRemark: attr?.AirlineRemark,
    FareType: attr?.FareType,
    IsLCC: attr?.IsLCC,
    ExtraBaggage: attr?.ExtraBaggage,
    conditions: {
      IsPassportRequiredAtBook: attr?.conditions?.IsPassportRequiredAtBook,
      IsPanRequiredAtBook: attr?.conditions?.IsPanRequiredAtBook,
      GSTAllowed: attr?.conditions?.GSTAllowed,
      IsGSTMandatory: attr?.conditions?.IsGSTMandatory,
    },
  };
}

// main formatter
export function mySearchFormatter(raw: any) {
  const journeyList = raw?.Search?.FlightDataList?.JourneyList?.[0] || [];

  const formattedJourneys = journeyList.map((flight: any) => ({
    flightDetails: flight.FlightDetails?.Details?.[0]?.map(mapLeg) || [],
    Price: mapPrice(flight.Price),
    //HACK: encoding the result Token
    ResultToken: encodeToken(flight.ResultToken,),
    Attr: mapAttr(flight.Attr),
  }));

  return {
    status: raw?.Status,
    message: raw?.Message,
    search: {
      FlightDataList: {
        JourneyList: formattedJourneys,
      },
    },
  };
}
