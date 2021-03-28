import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateList {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsDate()
  @IsNotEmpty()
  createdDate: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  defaultType: string;

  @IsArray()
  @IsNotEmpty()
  options: any;
}
