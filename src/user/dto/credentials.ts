import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentials {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsString()
  hd: string;

  @IsString()
  picture: string;
}
