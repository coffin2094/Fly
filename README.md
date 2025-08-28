# Flight API built with NestJS

> Integrate your personal third-party API and make it your own.

## Guide

- Use **ConfigModule** instead of Axios and **HttpModule** instead of dotenv
  for environment variables.

  > 💡 _Hint:_ Refer to the [NestJS documentation](https://docs.nestjs.com/)
  > for guidance on these modules.

- Use an `.env` file and follow the naming conventions for credentials. You
  can also manipulate them directly in `flight.service.ts` if needed.

- Format your API response according to your needs and requirements. Make it
  clean and user-friendly.

## Notes

- Keep your environment credentials secure and do not commit `.env` to Git.
- Always test your endpoints after any change in configuration.
- You can add more hints or tips here as your project evolves.
