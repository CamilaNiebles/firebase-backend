import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTask {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsArray()
  @IsNotEmpty()
  variables: any;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  workspace: string;
}
