import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TaskByWorkspace {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsArray()
  @IsNotEmpty()
  workspace: any;
}
