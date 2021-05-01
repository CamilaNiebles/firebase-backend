import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateForm {
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @IsArray()
  @IsNotEmpty()
  answeredQuestion: any;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  user: string;
}
