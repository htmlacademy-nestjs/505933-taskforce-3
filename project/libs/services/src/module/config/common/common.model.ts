import { IsNumber, IsString } from 'class-validator';
import { CommonConfig } from '../contracts';
import { EnvValidationMessage } from './constants';

export class CommonModel implements CommonConfig {
  @IsString({
    message: EnvValidationMessage.EnvironmentRequired,
  })
  environment: CommonConfig['environment'];
  @IsNumber(
    {},
    {
      message: EnvValidationMessage.ApplicationPort,
    }
  )
  port: number;

  @IsString({
    message: EnvValidationMessage.UrlServiceAccountRequired,
  })
  urlServiceAccount: string;

  @IsString({
    message: EnvValidationMessage.UrlServiceTaskRequired,
  })
  urlServiceTask: string;
}
