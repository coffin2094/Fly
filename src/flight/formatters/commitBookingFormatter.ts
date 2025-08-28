export function formatCommitBookingResponse(response: any) {
  if (response.Status !== "1" || !response.CommitBooking?.BookingDetails) {
    return { success: false, message: response.Message || "Booking failed" };
  }

  const booking = response.CommitBooking.BookingDetails;

  const passengerDetails = booking.PassengerDetails.map(p => ({
    PassengerId: p.PassengerId,
    Title: p.Title,
    FirstName: p.FirstName,
    LastName: p.LastName,
    PassengerType: p.PassengerType,
    TicketNumber: p.TicketNumber,
  }));

  const flightSegments = booking.JourneyList.FlightDetails.Details.flat().map(segment => ({
    Origin: {
      AirportCode: segment.Origin.AirportCode,
      City: segment.Origin.CityName,
      DateTime: segment.Origin.DateTime,
      Terminal: segment.Origin.Terminal,
    },
    Destination: {
      AirportCode: segment.Destination.AirportCode,
      City: segment.Destination.CityName,
      DateTime: segment.Destination.DateTime,
      Terminal: segment.Destination.Terminal,
    },
    Operator: {
      Code: segment.OperatorCode,
      Name: segment.OperatorName,
      FlightNumber: segment.FlightNumber,
    },
    CabinClass: segment.CabinClass,
    CabinBaggage: segment.Attr?.CabinBaggage || null,
  }));

  const price = {
    Currency: booking.Price.Currency,
    TotalFare: booking.Price.TotalDisplayFare,
    BasicFare: booking.Price.PriceBreakup.BasicFare,
    Tax: booking.Price.PriceBreakup.Tax,
    PassengerBreakup: booking.Price.PassengerBreakup,
  };

  return {
    success: true,
    BookingId: booking.BookingId,
    PNR: booking.PNR,
    Passengers: passengerDetails,
    Flights: flightSegments,
    Price: price,
  };
}
