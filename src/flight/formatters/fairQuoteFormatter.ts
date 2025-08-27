export function myFairQuoteFormatter(raw: any) {
  const { Status, Message = 'no message' } = raw;
  const details = raw?.UpdateFareQuote?.FareQuoteDetails?.JourneyList;

  if (!details) {
    return { Status, Message, UpdateFareQuote: null };
  }

  const mainFlight = details.FlightDetails?.Details?.[0]?.[0] ?? {};
  const flightList = details.FlightDetails?.Details?.[0] ?? [];

  const mappedFlightList = flightList.map((flight: any) => ({
    Origin: {
      AirportCode: flight?.Origin?.AirportCode,
      CityName: flight?.Origin?.CityName,
      AirportName: flight?.Origin?.AirportName,
      DateTime: flight?.Origin?.DateTime,
      Terminal: flight?.Origin?.Terminal,
      FDTV: flight?.Origin?.FDTV,
    },
    Destination: {
      AirportCode: flight?.Destination?.AirportCode,
      CityName: flight?.Destination?.CityName,
      AirportName: flight?.Destination?.AirportName,
      DateTime: flight?.Destination?.DateTime,
      Terminal: flight?.Destination?.Terminal,
      FATV: flight?.Destination?.FATV,
    },
    OperatorCode: mainFlight?.OperatorCode,
    DisplayOperatorCode: mainFlight?.DisplayOperatorCode,
    ValidatingAirline: mainFlight?.ValidatingAirline,
    OperatorName: mainFlight?.OperatorName,
    FlightNumber: mainFlight?.FlightNumber,
    CabinClass: mainFlight?.CabinClass,
    Operatedbyairline: mainFlight?.Operatedbyairline,
    Operatedbyairlinename: mainFlight?.Operatedbyairlinename,
    Duration: mainFlight?.Duration,
    Attr: {
      Baggage: mainFlight?.Attr?.Baggage,
      CabinBaggage: mainFlight?.Attr?.CabinBaggage,
      AvailableSeats: mainFlight?.Attr?.AvailableSeats,
    },
    stop_over: mainFlight?.stop_over,
  }));

  return {
    Status,
    Message,
    UpdateFareQuote: {
      FareQuoteDetails: {
        JourneyList: {
          FlightDetails: {
            Details: mappedFlightList,
          },
          Price: {
            Currency: details?.Price?.Currency,
            TotalDisplayFare: details?.Price?.TotalDisplayFare,
            PriceBreakup: {
              BasicFare: details?.Price?.PriceBreakup?.BasicFare,
              Tax: details?.Price?.PriceBreakup?.Tax,
              AgentCommission: details?.Price?.PriceBreakup?.AgentCommission,
              AgentTdsOnCommision: details?.Price?.PriceBreakup?.AgentTdsOnCommision,
            },
            PassengerBreakup: {
              ADT: {
                BasePrice: details?.PassengerBreakup?.ADT?.BasePrice ?? 0,
                Tax: details?.PassengerBreakup?.ADT?.Tax ?? 0,
                TotalPrice: details?.PassengerBreakup?.ADT?.TotalPrice ?? 0,
                PassengerCount: details?.PassengerBreakup?.ADT?.PassengerCount ?? 0,
              },
            },
          },
          ResultToken: details?.ResultToken,
          Attr: {
            IsRefundable: details?.Attr?.IsRefundable,
            AirlineRemark: details?.Attr?.AirlineRemark,
            FareType: details?.Attr?.FareType,
            IsLCC: details?.Attr?.IsLCC,
          },
          HoldTicket: details?.HoldTicket,
        },
      },
    },
  };
}
