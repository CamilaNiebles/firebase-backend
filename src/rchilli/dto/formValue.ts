import { IsNotEmpty, IsString } from 'class-validator';

export class FormValue {
  @IsString()
  @IsNotEmpty()
  rchilliKey: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  value: string;
}
