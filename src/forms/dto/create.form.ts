import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFormByUser {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  user: string;
}
