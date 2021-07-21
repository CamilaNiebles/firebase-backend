import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { RchilliResponse } from './rchilli.response';

export class CreateNewReading {
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsArray()
  @IsNotEmpty()
  company: string[];

  @IsString()
  @IsNotEmpty()
  resumeParserData: RchilliResponse;
}
