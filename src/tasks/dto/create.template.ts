import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskTemplate {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  displayUrl: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsArray()
  @IsNotEmpty()
  variables: any;
}
