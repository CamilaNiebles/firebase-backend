import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTemplate {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsDate()
  @IsNotEmpty()
  createdDate: Date;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsArray()
  @IsNotEmpty()
  question: any;
}
