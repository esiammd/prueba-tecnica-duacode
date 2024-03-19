import { IsString } from 'class-validator';

export class LoginOutputDto {
  @IsString()
  token: string;
}
