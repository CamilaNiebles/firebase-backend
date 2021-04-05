import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateForm {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsArray()
  @IsNotEmpty()
  question: any;
}
