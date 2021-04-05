import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateForm {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  unique: boolean;

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
